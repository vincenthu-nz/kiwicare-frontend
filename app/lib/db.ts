import postgres from 'postgres';

/**
 * Shared PostgreSQL client (Neon serverless).
 *
 * SSL is required for all Neon connections. The timezone is set to
 * Pacific/Auckland on each new connection to ensure date/time values are
 * consistent with the New Zealand business context.
 *
 * Connection string is read from the `DB_HOST` environment variable, which
 * must be set via `.env.local` locally or as a Vercel environment variable
 * in production.
 */
const sql = postgres(process.env.DB_HOST!, {
  ssl: 'require',
});

await sql`SET TIME ZONE 'Pacific/Auckland'`;

export default sql;
