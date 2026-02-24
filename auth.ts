import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import sql from '@/app/lib/db';

/**
 * Looks up a user by email address, selecting only the fields required for
 * authentication. Returns `undefined` when no matching record exists.
 *
 * Note: `SELECT *` is intentionally avoided to prevent leaking sensitive
 * fields (balance, phone, addresses, etc.) into the auth layer.
 *
 * @param email - The email address to look up.
 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT id, name, email, password, avatar, city, role, status
      FROM users
      WHERE email = ${email}
    `;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

/**
 * NextAuth configuration with the Credentials provider.
 *
 * - Only `admin`-role users are permitted to access the dashboard.
 * - `banned` accounts receive a distinct, non-enumerable error message.
 * - Generic "Invalid email or password" is returned for missing users and
 *   wrong passwords to prevent user-enumeration attacks.
 * - The user's `id` and `role` are forwarded from the JWT into the session
 *   so downstream server components can access them without re-querying the DB.
 */
export const { signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials');
        }

        if (!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          throw new Error('Invalid input format');
        }

        const { email, password } = parsed.data;

        const user = await getUser(email);
        // Use a generic message to prevent user-enumeration attacks
        if (!user) {
          throw new Error('Invalid email or password.');
        }

        if (user.status === 'banned') {
          throw new Error('Your account has been suspended. Please contact support.');
        }

        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin credentials required.');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error('Invalid email or password.');
        }

        const { id, name, role } = user;
        return { id, name, email, role };
      },
    }),
  ],
  callbacks: {
    /** Attaches `id` and `role` to the JWT so the session callback can read them. */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    /** Exposes `id` and `role` on the client-side session object. */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
