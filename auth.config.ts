export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({
      auth,
      request,
    }: {
      auth: any;
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
