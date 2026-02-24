import { describe, it, expect } from 'vitest';
import { InvoiceSchema } from '../validations';

// ---------------------------------------------------------------------------
// InvoiceSchema — create mode ('userId')
// ---------------------------------------------------------------------------
describe("InvoiceSchema('userId')", () => {
  const schema = InvoiceSchema('userId');

  it('accepts valid input', () => {
    const result = schema.safeParse({
      userId: 'abc-123',
      amount: 50,
      status: 'pending',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing userId', () => {
    const result = schema.safeParse({ amount: 10, status: 'paid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.userId).toBeDefined();
    }
  });

  it('rejects amount of 0', () => {
    const result = schema.safeParse({ userId: 'abc', amount: 0, status: 'paid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toBeDefined();
    }
  });

  it('rejects a negative amount', () => {
    const result = schema.safeParse({ userId: 'abc', amount: -5, status: 'paid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toBeDefined();
    }
  });

  it('coerces a string amount to a number', () => {
    const result = schema.safeParse({ userId: 'abc', amount: '25', status: 'paid' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(25);
    }
  });

  it('rejects an invalid status', () => {
    const result = schema.safeParse({
      userId: 'abc',
      amount: 10,
      status: 'refunded',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.status).toBeDefined();
    }
  });

  it('accepts "pending" and "paid" as valid statuses', () => {
    for (const status of ['pending', 'paid'] as const) {
      const result = schema.safeParse({ userId: 'abc', amount: 10, status });
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// InvoiceSchema — update mode ('customerId')
// ---------------------------------------------------------------------------
describe("InvoiceSchema('customerId')", () => {
  const schema = InvoiceSchema('customerId');

  it('accepts valid input with customerId', () => {
    const result = schema.safeParse({
      customerId: 'cust-456',
      amount: 100,
      status: 'paid',
    });
    expect(result.success).toBe(true);
  });

  it('rejects when userId is passed instead of customerId', () => {
    // The schema expects 'customerId', not 'userId'
    const result = schema.safeParse({
      userId: 'abc',
      amount: 10,
      status: 'paid',
    });
    // customerId is missing → should fail
    expect(result.success).toBe(false);
  });
});
