import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* MOBILE ONLY */}
      <div className="fixed inset-x-0 top-0 bg-white md:hidden">
        <div className="flex flex-col px-3 py-4">
          <Link
            className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600"
            href="/"
          >
            <div className="w-32 text-white">
              <Logo />
            </div>
          </Link>

          <div className="flex justify-between space-x-2">
            <NavLinks />

            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button className="flex h-[48px] items-center justify-center rounded-md bg-gray-50 p-3 hover:bg-sky-100 hover:text-blue-600">
                <PowerIcon className="w-6" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header on mobile */}
      <div className="mt-[135px] flex-1 overflow-y-auto md:hidden" />

      {/* DESKTOP ONLY */}
      <div className="hidden md:flex md:h-full md:flex-col">
        <Link
          className="mb-2 flex h-40 items-center justify-center rounded-md bg-blue-600"
          href="/"
        >
          <div className="w-40 text-white">
            <Logo />
          </div>
        </Link>

        <div className="flex grow justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks />

          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
