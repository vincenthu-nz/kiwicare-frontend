import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

/**
 * Extracts the current user's ID from the NextAuth JWT stored in the request
 * cookies. Intended for use inside Server Components and Server Actions where
 * a full session object is not needed — only the caller's identity.
 *
 * Returns `null` when called from an unauthenticated context (no valid token).
 */
export async function getCurrentUserId(): Promise<string | null> {
  const token: JWT | null = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
  });

  return token?.id ?? null;
}
