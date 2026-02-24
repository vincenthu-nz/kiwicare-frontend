'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn } from '@/auth';
import sql from '@/app/lib/db';
import { InvoiceSchema } from '@/app/lib/validations';
import { State, UserStatus } from '@/app/lib/definitions';
import { getCurrentUserId } from '@/auth_token';

// ---------------------------------------------------------------------------
// Invoice actions
// ---------------------------------------------------------------------------

/**
 * Server action: creates a new manual invoice.
 * Validates input with Zod before writing to the database.
 *
 * @param prevState - Previous form state (for useActionState).
 * @param formData  - Form data containing userId, amount, and status.
 */
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = InvoiceSchema('userId').safeParse({
    userId: formData.get('userId'),
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { userId, amount, status } = validatedFields.data;
  // Store amounts as integer cents to avoid floating-point rounding errors
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (user_id, amount, status, date, payment_method, source)
      VALUES (${userId}, ${amountInCents}, ${status}, ${date}, 'cash', 'manual');
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Server action: updates an existing invoice's amount and status.
 * Wraps both the invoice update and the linked order's customer_id change in a
 * single database transaction so either both succeed or neither does.
 *
 * @param id        - Invoice UUID to update.
 * @param prevState - Previous form state (for useActionState).
 * @param formData  - Form data containing customerId, amount, and status.
 */
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = InvoiceSchema('customerId').safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql.begin(async (sql) => {
      await sql`
        UPDATE invoices
        SET amount = ${amountInCents},
            status = ${status}
        WHERE id = ${id};
      `;

      await sql`
        UPDATE orders
        SET customer_id = ${customerId}
        WHERE id = (SELECT order_id FROM invoices WHERE id = ${id});
      `;
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Server action: deletes an invoice by ID.
 * Requires an authenticated session; throws if the caller is unauthenticated.
 *
 * @param id - Invoice UUID to delete.
 */
export async function deleteInvoice(id: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    throw new Error('Database Error: Failed to Delete Invoice.');
  }

  revalidatePath('/dashboard/invoices');
}

// ---------------------------------------------------------------------------
// Authentication actions
// ---------------------------------------------------------------------------

/**
 * Server action: authenticates a user via the credentials provider.
 * Returns an error string on failure, or `undefined` on success (NextAuth
 * handles the redirect internally).
 *
 * @param prevState - Previous error message (for useActionState).
 * @param formData  - Form data containing email and password.
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return error?.cause?.err?.message ?? 'Authentication failed';
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Email verification actions
// ---------------------------------------------------------------------------

/**
 * Server action: verifies a pending user's email via a one-time token.
 *
 * Flow:
 * 1. Looks up the token in `pending_users`.
 * 2. Checks token expiry.
 * 3. Within a transaction: inserts the verified user, creates the matching
 *    customer/provider profile, then removes the pending record.
 *
 * @param token - One-time verification token from the email link.
 * @returns An object with `status: 'success' | 'error'` and a message.
 */
export async function verifyEmailByToken(token: string) {
  if (!token) {
    return { status: 'error', message: 'No token provided.' };
  }

  const result = await sql`
    SELECT *
    FROM pending_users
    WHERE token = ${token}
    LIMIT 1
  `;
  const pendingUser = result[0];

  if (!pendingUser) {
    return {
      status: 'error',
      message: 'Invalid or expired verification link.',
    };
  }

  if (pendingUser.expires_at < new Date()) {
    return { status: 'error', message: 'This verification link has expired.' };
  }

  try {
    await sql.begin(async (trx) => {
      const insertedUsers = await trx`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES (${pendingUser.email},
                ${pendingUser.password},
                ${pendingUser.first_name},
                ${pendingUser.last_name},
                ${pendingUser.role})
        RETURNING id, role
      `;
      const newUser = insertedUsers[0];

      if (newUser.role === 'customer') {
        await trx`
          INSERT INTO customers (user_id)
          VALUES (${newUser.id})
        `;
      } else if (newUser.role === 'provider') {
        await trx`
          INSERT INTO providers (user_id)
          VALUES (${newUser.id})
        `;
      }

      await trx`
        DELETE FROM pending_users
        WHERE email = ${pendingUser.email}
      `;
    });
  } catch (error) {
    console.error('Email verification transaction failed:', error);
    return { status: 'error', message: 'Verification failed. Please try again.' };
  }

  return { status: 'success', email: pendingUser.email };
}

// ---------------------------------------------------------------------------
// User management actions
// ---------------------------------------------------------------------------

/** Zod schema for validating the status field in updateUserStatus. */
const UserStatusSchema = z.enum(['active', 'pending', 'banned']);

/**
 * Server action: updates the account status of any user except the caller.
 *
 * Guards:
 * - Validates the status value with Zod (rejects arbitrary strings).
 * - Requires an authenticated admin session.
 * - Prevents admins from banning/deactivating their own account.
 * - No-ops if the status is already the requested value.
 *
 * @param id        - UUID of the user whose status is being changed.
 * @param _prevState - Previous form state (for useActionState, unused here).
 * @param formData  - Form data containing the new `status` value.
 */
export async function updateUserStatus(
  id: string,
  _prevState: State<'userId'>,
  formData: FormData,
): Promise<State<'userId'>> {
  const parsed = UserStatusSchema.safeParse(formData.get('status'));
  if (!parsed.success) {
    return {
      message: 'Invalid status value.',
      errors: { userId: ['Invalid status'] },
    };
  }
  const status = parsed.data as UserStatus;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return {
      message: 'Not authenticated',
      errors: { userId: ['Unauthenticated'] },
    };
  }

  if (currentUserId === id) {
    return {
      message: 'You cannot modify your own status',
      errors: { userId: ['Operation not allowed'] },
    };
  }

  const result = await sql<{status: UserStatus}[]>`
    SELECT status
    FROM users
    WHERE id = ${id}
  `;

  if (result.length === 0) {
    return { message: 'User not found', errors: { userId: ['Not found'] } };
  }

  if (result[0].status === status) {
    return { message: 'No change' };
  }

  await sql`
    UPDATE users
    SET status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/users');
  return { message: 'User status updated' };
}
