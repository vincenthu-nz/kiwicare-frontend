'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import sql from '@/app/lib/db';
import { InvoiceSchema } from '@/app/lib/validations';
import { State } from '@/app/lib/definitions';

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

export async function deleteInvoice(id: string) {
  await sql`DELETE
            FROM invoices
            WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

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

  await sql`
    INSERT INTO users (email, password, first_name, last_name)
    VALUES (${pendingUser.email}, ${pendingUser.password}, ${pendingUser.first_name}, ${pendingUser.last_name})
  `;

  await sql`
    DELETE
    FROM pending_users
    WHERE email = ${pendingUser.email}
  `;

  return { status: 'success', email: pendingUser.email };
}
