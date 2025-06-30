import postgres from 'postgres';

const sql = postgres(process.env.DB_HOST!, {
  ssl: 'require',
});

await sql`SET TIME ZONE 'Pacific/Auckland'`;

export default sql;
