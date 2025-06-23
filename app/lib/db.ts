import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
});

await sql`SET TIME ZONE 'Pacific/Auckland'`;

export default sql;
