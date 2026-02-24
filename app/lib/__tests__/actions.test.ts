/**
 * Unit tests for server actions in actions.ts.
 *
 * The PostgreSQL client and auth helpers are mocked so these tests run
 * entirely in-process without a real database connection. The goal is to
 * validate:
 *  - Input validation (Zod) returns correct errors
 *  - Happy-path branches call the DB with correct arguments
 *  - Auth guards reject unauthenticated callers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Module mocks — must be declared before importing the module under test
// ---------------------------------------------------------------------------

// Mock next-auth to prevent it from importing `next/server` (not available in Vitest)
vi.mock('next-auth', () => ({
  AuthError: class AuthError extends Error {
    cause?: { err?: Error };
  },
}));

// Mock the database client
vi.mock('@/app/lib/db', () => {
  const baseFn = vi.fn().mockResolvedValue([]);
  const sqlMock = Object.assign(baseFn, {
    begin: vi.fn(async (fn: (sql: typeof baseFn) => Promise<void>) => fn(baseFn)),
  });
  return { default: sqlMock };
});

// Mock Next.js navigation helpers (redirect/revalidatePath throw in tests)
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

// Mock NextAuth signIn
vi.mock('@/auth', () => ({ signIn: vi.fn() }));

// Mock getCurrentUserId — default: authenticated user
vi.mock('@/auth_token', () => ({
  getCurrentUserId: vi.fn().mockResolvedValue('user-123'),
}));

// ---------------------------------------------------------------------------
// Imports — after mocks are in place
// ---------------------------------------------------------------------------
import { createInvoice, deleteInvoice, updateUserStatus } from '../actions';
import sql from '@/app/lib/db';
import { getCurrentUserId } from '@/auth_token';
import { revalidatePath } from 'next/cache';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

// ---------------------------------------------------------------------------
// createInvoice
// ---------------------------------------------------------------------------
describe('createInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns field errors when required fields are missing', async () => {
    const state = { errors: {}, message: null };
    const formData = makeFormData({});
    const result = await createInvoice(state, formData);
    expect(result.errors).toBeDefined();
    expect(result.message).toMatch(/Missing Fields/);
  });

  it('returns an error when amount is 0', async () => {
    const state = { errors: {}, message: null };
    const formData = makeFormData({
      userId: 'user-abc',
      amount: '0',
      status: 'pending',
    });
    const result = await createInvoice(state, formData);
    expect(result.errors?.amount).toBeDefined();
  });

  it('returns an error for an invalid status', async () => {
    const state = { errors: {}, message: null };
    const formData = makeFormData({
      userId: 'user-abc',
      amount: '50',
      status: 'invalid_status',
    });
    const result = await createInvoice(state, formData);
    expect(result.errors?.status).toBeDefined();
  });

  it('inserts a record and redirects on valid input', async () => {
    const state = { errors: {}, message: null };
    const formData = makeFormData({
      userId: 'user-abc',
      amount: '50',
      status: 'pending',
    });
    await expect(createInvoice(state, formData)).rejects.toThrow('NEXT_REDIRECT');
    expect(sql).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');
  });

  it('returns a database error message when INSERT fails', async () => {
    vi.mocked(sql).mockRejectedValueOnce(new Error('DB down'));
    const state = { errors: {}, message: null };
    const formData = makeFormData({
      userId: 'user-abc',
      amount: '50',
      status: 'pending',
    });
    const result = await createInvoice(state, formData);
    expect(result.message).toMatch(/Database Error/);
  });
});

// ---------------------------------------------------------------------------
// deleteInvoice
// ---------------------------------------------------------------------------
describe('deleteInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUserId).mockResolvedValue('user-123');
  });

  it('throws Unauthorized when no session exists', async () => {
    vi.mocked(getCurrentUserId).mockResolvedValueOnce(null);
    await expect(deleteInvoice('inv-1')).rejects.toThrow('Unauthorized');
  });

  it('deletes the invoice and revalidates the path for authenticated users', async () => {
    await deleteInvoice('inv-1');
    expect(sql).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');
  });

  it('throws a database error message when DELETE fails', async () => {
    vi.mocked(sql).mockRejectedValueOnce(new Error('DB error'));
    await expect(deleteInvoice('inv-1')).rejects.toThrow('Database Error');
  });
});

// ---------------------------------------------------------------------------
// updateUserStatus
// ---------------------------------------------------------------------------
describe('updateUserStatus', () => {
  const prevState = { errors: {}, message: null };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUserId).mockResolvedValue('admin-user');
    // Default DB response: user exists with status 'active'
    vi.mocked(sql).mockResolvedValue([{ status: 'active' }] as any);
  });

  it('returns an error for an invalid status value', async () => {
    const formData = makeFormData({ status: 'superuser' });
    const result = await updateUserStatus('target-user', prevState, formData);
    expect(result.message).toMatch(/Invalid status/);
  });

  it('returns an error when the caller is unauthenticated', async () => {
    vi.mocked(getCurrentUserId).mockResolvedValueOnce(null);
    const formData = makeFormData({ status: 'banned' });
    const result = await updateUserStatus('target-user', prevState, formData);
    expect(result.message).toMatch(/Not authenticated/);
  });

  it('prevents a user from changing their own status', async () => {
    vi.mocked(getCurrentUserId).mockResolvedValueOnce('same-user');
    const formData = makeFormData({ status: 'banned' });
    const result = await updateUserStatus('same-user', prevState, formData);
    expect(result.message).toMatch(/cannot modify your own/);
  });

  it('returns "User not found" when the target does not exist', async () => {
    vi.mocked(sql).mockResolvedValueOnce([] as any);
    const formData = makeFormData({ status: 'banned' });
    const result = await updateUserStatus('ghost-user', prevState, formData);
    expect(result.message).toMatch(/User not found/);
  });

  it('returns "No change" when status is already the requested value', async () => {
    // User already has status 'banned'
    vi.mocked(sql).mockResolvedValueOnce([{ status: 'banned' }] as any);
    const formData = makeFormData({ status: 'banned' });
    const result = await updateUserStatus('target-user', prevState, formData);
    expect(result.message).toBe('No change');
  });

  it('updates status and revalidates path on success', async () => {
    // First call: SELECT returns current status 'active'
    // Second call: UPDATE (returns nothing meaningful)
    vi.mocked(sql)
      .mockResolvedValueOnce([{ status: 'active' }] as any)
      .mockResolvedValueOnce([] as any);

    const formData = makeFormData({ status: 'banned' });
    const result = await updateUserStatus('target-user', prevState, formData);
    expect(result.message).toBe('User status updated');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/users');
  });
});
