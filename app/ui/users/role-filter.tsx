'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  BriefcaseIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

type RoleItem = {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function RoleFilter({
  onRoleChange,
}: {
  onRoleChange?: (role: string) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRole = searchParams.get('role') || '';

  const roles: RoleItem[] = [
    { label: 'All', value: '', icon: UserGroupIcon },
    { label: 'Admin', value: 'admin', icon: ShieldCheckIcon },
    { label: 'Provider', value: 'provider', icon: BriefcaseIcon },
    { label: 'Customer', value: 'customer', icon: ShoppingCartIcon },
  ];

  return (
    <div className="mt-2 flex flex-wrap justify-between md:mt-5 md:justify-start md:gap-2">
      {roles.map(({ label, value, icon: Icon }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
          params.set('role', value);
        } else {
          params.delete('role');
        }

        params.delete('page');

        const isActive = currentRole === value || (!value && !currentRole);
        const href = `${pathname}?${params.toString()}`;

        return (
          <Link
            key={label}
            href={href as string}
            onClick={() => onRoleChange?.(value)}
            className={`flex items-center gap-2 rounded px-3 py-1 text-sm transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
