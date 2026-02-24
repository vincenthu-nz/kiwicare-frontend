import type { Session } from 'next-auth';

/**
 * Base NextAuth configuration shared between the Edge middleware and the main
 * NextAuth instance in `auth.ts`.
 *
 * Routing rules (evaluated in order):
 * 1. Dashboard routes (`/dashboard/**`) → require an authenticated session.
 * 2. Public routes (`/login`, `/register`, `/verify-email`) → always allowed.
 * 3. Any other route while authenticated → redirect to `/dashboard`.
 * 4. Everything else → allow through (landing page, public static assets).
 *
 * `providers` is left empty here because this config is used in the Edge
 * middleware where the full credentials provider cannot run (no Node.js APIs).
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({
      auth,
      request,
    }: {
      auth: Session | null;
      request: import('next/server').NextRequest;
    }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      const isOnDashboard = pathname.startsWith('/dashboard');
      const isPublic = ['/login', '/register', '/verify-email'].some((p) =>
        pathname.startsWith(p),
      );

      if (isOnDashboard) {
        return isLoggedIn;
      } else if (isPublic) {
        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
