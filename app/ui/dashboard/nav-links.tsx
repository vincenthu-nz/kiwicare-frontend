'use client';

import { DocumentDuplicateIcon, HomeIcon, ShoppingBagIcon, UserGroupIcon, } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        const isActive =
          link.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(link.href);

        return (
          <a
            key={link.href}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': isActive,
              },
            )}
          >
            <LinkIcon className="w-6"/>
            <p className="hidden md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
