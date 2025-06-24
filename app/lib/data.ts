'use server';

import {
  CustomerField,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  State,
  User,
  UserStatus,
} from './definitions';
import { formatCurrency } from './utils';
import sql from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function fetchRevenue(): Promise<
  { month: string; revenue: number }[]
> {
  try {
    const data = await sql<(Revenue & { month: string })[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', date), 'Mon') AS month,
             SUM(amount)                               AS revenue
      FROM invoices
      WHERE status = 'paid'
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY DATE_TRUNC('month', date)
    `;

    return data.map((item) => ({
      ...item,
      revenue: item.revenue / 100,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount,
             users.name,
             users.avatar,
             users.email,
             invoices.id
      FROM invoices
             LEFT JOIN orders ON invoices.order_id = orders.id
             LEFT JOIN customers ON orders.customer_id = customers.id
             LEFT JOIN users ON
        (customers.user_id = users.id OR invoices.user_id = users.id)
      ORDER BY invoices.date DESC
      LIMIT 5`;

    return data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [row] = await sql<
      {
        invoice_count: number;
        customer_count: number;
        provider_count: number;
        total_paid: number;
        total_pending: number;
      }[]
    >`
      SELECT (SELECT COUNT(*) FROM invoices)                                          AS invoice_count,
             (SELECT COUNT(*) FROM users WHERE role = 'customer')                     AS customer_count,
             (SELECT COUNT(*) FROM users WHERE role = 'provider')                     AS provider_count,
             (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE status = 'paid')    AS total_paid,
             (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE status = 'pending') AS total_pending;
    `;

    return {
      numberOfCustomers: row.customer_count,
      numberOfProvider: row.provider_count,
      numberOfInvoices: row.invoice_count,
      totalPaidInvoices: row.total_paid / 100,
      totalPendingInvoices: row.total_pending / 100,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<InvoicesTable[]>`
      SELECT invoices.id,
             invoices.amount,
             invoices.date,
             invoices.status,
             users.name,
             users.email,
             users.avatar
      FROM invoices
             JOIN users ON invoices.user_id = users.id
      WHERE users.name ILIKE ${`%${query}%`}
         OR users.email ILIKE ${`%${query}%`}
         OR invoices.amount::text ILIKE ${`%${query}%`}
         OR invoices.date::text ILIKE ${`%${query}%`}
         OR invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM invoices
             LEFT JOIN orders ON invoices.order_id = orders.id
             LEFT JOIN customers ON orders.customer_id = customers.id
             LEFT JOIN users ON customers.user_id = users.id
      WHERE users.name ILIKE ${`%${query}%`}
         OR users.email ILIKE ${`%${query}%`}
         OR invoices.amount::text ILIKE ${`%${query}%`}
         OR invoices.date::text ILIKE ${`%${query}%`}
         OR invoices.status ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT invoices.id,
             invoices.amount,
             invoices.status,
             orders.customer_id
      FROM invoices
             LEFT JOIN orders ON invoices.order_id = orders.id
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    return await sql<CustomerField[]>`
      SELECT customers.id,
             users.name
      FROM customers
             JOIN users ON customers.user_id = users.id
      ORDER BY name
    `;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchUsers() {
  try {
    return await sql<User[]>`
      SELECT *
      FROM users
      ORDER BY name
    `;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchUsersPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE name ILIKE ${`%${query}%`}
         OR email ILIKE ${`%${query}%`};
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number,
  role: string,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const likeQuery = `%${query}%`;

  let baseSQL = `
    SELECT id, name, email, avatar, city, role, status
    FROM users
    WHERE (name ILIKE $1 OR email ILIKE $1)
  `;
  const values: any[] = [likeQuery];

  // If a role is provided, add it to the WHERE clause
  if (role) {
    baseSQL += ` AND role = $2`;
    values.push(role);
  }

  baseSQL += ` ORDER BY name LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(ITEMS_PER_PAGE, offset);

  try {
    return await sql.unsafe(baseSQL, values);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch users.');
  }
}

export async function updateUserStatus(
  id: string,
  _prevState: State<'userId'>,
  formData: FormData,
): Promise<State<'userId'>> {
  const status = formData.get('status') as UserStatus;

  const result = await sql<{ status: UserStatus }[]>`
    SELECT status
    FROM users
    WHERE id = ${id}
  `;

  if (result.length === 0) {
    return { message: 'User not found', errors: { userId: ['Not found'] } };
  }

  const currentStatus = result[0].status;
  if (currentStatus === status) {
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
