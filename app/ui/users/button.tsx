'use client';

import { Menu } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { JSX, useTransition } from 'react';
import { Role, UserStatus } from '@/app/lib/definitions';
import { updateUserStatus } from '@/app/lib/data';

const STATUS_ITEMS: {
  key: UserStatus;
  label: string;
  icon: JSX.Element;
  colorClass: string;
}[] = [
  {
    key: UserStatus.ACTIVE,
    label: 'active',
    icon: <CheckIcon className="h-4 w-4 text-green-600" />,
    colorClass: 'text-green-600',
  },
  {
    key: UserStatus.PENDING,
    label: 'pending',
    icon: <ClockIcon className="h-4 w-4 text-gray-600" />,
    colorClass: 'text-gray-900',
  },
  {
    key: UserStatus.BANNED,
    label: 'banned',
    icon: <XMarkIcon className="h-4 w-4 text-red-600" />,
    colorClass: 'text-red-500',
  },
];

export function EditUserStatus({
  id,
  status,
  role,
}: {
  id: string;
  status: UserStatus;
  role: string;
}) {
  const availableItems =
    role === Role.PROVIDER
      ? STATUS_ITEMS
      : STATUS_ITEMS.filter((item) => item.key !== UserStatus.PENDING);

  const filteredItems = availableItems.filter((item) => item.key !== status);

  const [isPending, startTransition] = useTransition();

  const handleClick = (newStatus: UserStatus) => {
    const formData = new FormData();
    formData.append('status', newStatus);

    startTransition(() => {
      updateUserStatus(id, { message: null, errors: {} }, formData);
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-100 focus:outline-none">
        <ChevronDownIcon className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div>
          {filteredItems.map((item, index) => (
            <div key={item.key}>
              {index > 0 && <div className="mx-6 my-1 h-px bg-gray-100" />}

              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => handleClick(item.key)}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    } ${item.colorClass}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
