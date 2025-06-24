import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

export async function getCurrentUserId(): Promise<string | null> {
  const token: JWT | null = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
  });

  return token?.id ?? null;
}
