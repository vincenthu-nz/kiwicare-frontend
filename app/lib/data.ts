'use server';

import {
  CustomerField,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  OrdersTable,
  Revenue,
  User,
} from './definitions';
import { formatCurrency } from './utils';
import sql from '@/app/lib/db';

/** Number of records returned per paginated page. */
const ITEMS_PER_PAGE = 6;

/**
 * Fetches monthly revenue totals for paid invoices.
 * Amounts are stored as integer cents in the DB and converted to dollars here.
 */
export async function fetchRevenue(): Promise<
  {month: string; revenue: number}[]
> {
  try {
    const data = await sql<(Revenue & {month: string})[]>`
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

/**
 * Fetches the 5 most recent invoices for the given role (customer or provider).
 * The join resolves the display user: either via the order's customer or the
 * invoice's direct user_id for manual/admin invoices.
 *
 * @param role - Invoice role to filter by. Defaults to 'customer'.
 */
export async function fetchLatestInvoices(role: 'customer' | 'provider' = 'customer') {
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
      WHERE invoices.role = ${role.toLowerCase()}
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

/**
 * Fetches aggregate statistics for the dashboard overview cards.
 * Uses a single query with correlated subqueries for efficiency.
 * Monetary amounts are converted from cents to dollars.
 */
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

/**
 * Fetches a paginated, searchable list of invoices.
 * Searches across user name, email, amount, date, status, and order ID.
 *
 * @param query - Free-text search string.
 * @param currentPage - 1-based page number.
 */
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<InvoicesTable[]>`
      SELECT invoices.id,
             invoices.amount,
             invoices.platform_fee,
             invoices.date,
             invoices.status,
             invoices.role,
             invoices.order_id,
             users.id as user_id,
             users.name,
             users.email,
             users.avatar
      FROM invoices
             JOIN users ON invoices.user_id = users.id
      WHERE users.name ILIKE ${`%${query}%`}
         OR users.email ILIKE ${`%${query}%`}
         OR invoices.amount::text ILIKE ${`%${query}%`}
         OR invoices.date::text ILIKE ${`%${query}%`}
         OR invoices.status::text ILIKE ${`%${query}%`}
         OR invoices.order_id::text ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

/**
 * Returns the total number of pages for a paginated invoice search.
 *
 * @param query - Free-text search string.
 */
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
         OR invoices.status::text ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

/**
 * Fetches a single invoice by its UUID, converting amount from cents to dollars.
 *
 * @param id - Invoice UUID.
 * @returns The invoice form data, or `undefined` if not found.
 */
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

    return data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars for the edit form
      amount: invoice.amount / 100,
    }))[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

/**
 * Fetches all customer records as lightweight id/name pairs for select fields.
 */
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
    throw new Error('Failed to fetch all customers.');
  }
}

/**
 * Fetches all users, explicitly excluding sensitive fields such as passwords.
 */
export async function fetchUsers() {
  try {
    return await sql<User[]>`
      SELECT id, name, email, avatar, city, role, status
      FROM users
      ORDER BY name
    `;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

/**
 * Returns the total number of pages for a paginated user search.
 * Supports optional role filtering using safe parameterized queries.
 *
 * @param query - Free-text search string (matches name or email).
 * @param role  - Optional role filter ('customer' | 'provider' | 'admin').
 */
export async function fetchUsersPages(query: string = '', role: string = '') {
  const likeQuery = `%${query}%`;
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE (name ILIKE ${likeQuery} OR email ILIKE ${likeQuery})
      ${role ? sql`AND role = ${role}` : sql``}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}

/**
 * Fetches a paginated, searchable list of users.
 * Supports optional role filtering. Uses safe parameterized template literals
 * throughout — no raw string interpolation.
 *
 * @param query       - Free-text search string (matches name or email).
 * @param currentPage - 1-based page number.
 * @param role        - Optional role filter ('customer' | 'provider' | 'admin').
 */
export async function fetchFilteredUsers(
  query: string,
  currentPage: number,
  role: string,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const likeQuery = `%${query}%`;
  try {
    return await sql<User[]>`
      SELECT id, name, email, avatar, city, role, status
      FROM users
      WHERE (name ILIKE ${likeQuery} OR email ILIKE ${likeQuery})
      ${role ? sql`AND role = ${role}` : sql``}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch users.');
  }
}

/**
 * Returns the total number of pages for a paginated order search.
 * Searches across customer, provider, service name, status, date, and amount.
 *
 * @param query - Free-text search string.
 */
export async function fetchOrdersPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM orders
             LEFT JOIN users AS customers ON orders.customer_id = customers.id
             LEFT JOIN users AS providers ON orders.provider_id = providers.id
             LEFT JOIN services ON orders.service_id = services.id
             LEFT JOIN invoices ON invoices.order_id = orders.id
      WHERE customers.name ILIKE ${`%${query}%`}
         OR customers.email ILIKE ${`%${query}%`}
         OR providers.name ILIKE ${`%${query}%`}
         OR providers.email ILIKE ${`%${query}%`}
         OR services.name ILIKE ${`%${query}%`}
         OR orders.status::text ILIKE ${`%${query}%`}
         OR orders.created_at::text ILIKE ${`%${query}%`}
         OR invoices.amount::text ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of orders.');
  }
}

/**
 * Fetches a paginated, searchable list of orders with full relational data
 * (customer, provider, service). Includes location coordinates and route geometry
 * for map rendering.
 *
 * @param query       - Free-text search string.
 * @param currentPage - 1-based page number.
 */
export async function fetchFilteredOrders(
  query: string = '',
  currentPage: number = 1,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<OrdersTable[]>`
      SELECT orders.id,
             c.id                     AS customer_id,
             c.name                   AS customer_name,
             c.avatar                 AS customer_avatar,
             orders.service_address   AS customer_address,
             orders.service_latitude  AS customer_latitude,
             orders.service_longitude AS customer_longitude,
             p.id                     AS provider_id,
             p.name                   AS provider_name,
             p.avatar                 AS provider_avatar,
             providers.base_address   AS provider_address,
             providers.base_latitude  AS provider_latitude,
             providers.base_longitude AS provider_longitude,
             services.name            AS service,
             orders.status,
             orders.payment_status,
             orders.route_geometry,
             orders.distance_m,
             orders.service_fee,
             orders.travel_fee,
             orders.total_amount,
             orders.created_at        AS date
      FROM orders
             LEFT JOIN customers ON orders.customer_id = customers.id
             LEFT JOIN users AS c ON customers.user_id = c.id
             LEFT JOIN providers ON orders.provider_id = providers.id
             LEFT JOIN users AS p ON providers.user_id = p.id
             LEFT JOIN services ON orders.service_id = services.id
      WHERE c.name ILIKE ${`%${query}%`}
         OR c.email ILIKE ${`%${query}%`}
         OR p.name ILIKE ${`%${query}%`}
         OR p.email ILIKE ${`%${query}%`}
         OR services.name ILIKE ${`%${query}%`}
         OR orders.total_amount::text ILIKE ${`%${query}%`}
         OR orders.created_at::text ILIKE ${`%${query}%`}
      ORDER BY orders.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}

/**
 * Fetches a single order by UUID along with its associated reviews.
 * Returns `null` for the order if not found.
 *
 * @param id - Order UUID.
 */
export async function fetchOrderById(id: string): Promise<{
  order: OrdersTable | null;
  reviews: {authorRole: string; rating: number; comment: string | null}[];
}> {
  try {
    const data = await sql<OrdersTable[]>`
      SELECT orders.id,
             c.id                     AS customer_id,
             c.name                   AS customer_name,
             c.avatar                 AS customer_avatar,
             orders.service_address   AS customer_address,
             orders.service_latitude  AS customer_latitude,
             orders.service_longitude AS customer_longitude,
             p.id                     AS provider_id,
             p.name                   AS provider_name,
             p.avatar                 AS provider_avatar,
             providers.base_address   AS provider_address,
             providers.base_latitude  AS provider_latitude,
             providers.base_longitude AS provider_longitude,
             services.name            AS service,
             orders.distance_m,
             orders.service_fee,
             orders.travel_fee,
             orders.total_amount,
             orders.created_at        AS date,
             orders.route_geometry,
             orders.status,
             orders.payment_status
      FROM orders
             LEFT JOIN customers ON orders.customer_id = customers.id
             LEFT JOIN users AS c ON customers.user_id = c.id
             LEFT JOIN providers ON orders.provider_id = providers.id
             LEFT JOIN users AS p ON providers.user_id = p.id
             LEFT JOIN services ON orders.service_id = services.id
      WHERE orders.id = ${id}
    `;

    const order = data[0] ?? null;

    if (!order) {
      return { order: null, reviews: [] };
    }

    const reviewsData = await sql<{author_role: string; rating: number; comment: string | null}[]>`
      SELECT author_role, rating, comment
      FROM reviews
      WHERE order_id = ${id}
    `;

    const reviews = reviewsData.map((r) => ({
      authorRole: r.author_role,
      rating: r.rating,
      comment: r.comment,
    }));

    return { order, reviews };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order.');
  }
}
