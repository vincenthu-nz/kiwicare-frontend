'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { JSX } from 'react';
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

  const handleClick = async (newStatus: UserStatus) => {
    const formData = new FormData();
    formData.append('status', newStatus);

    await updateUserStatus(id, { message: null, errors: {} }, formData);
  };

  return (
    <Menu as="div" className="relative z-20 inline-block text-left">
      <MenuButton className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-100 focus:outline-none">
        <ChevronDownIcon className="h-4 w-4" />
      </MenuButton>

      <MenuItems className="absolute right-0 z-20 mt-2 w-40 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div>
          {filteredItems.map((item, index) => (
            <div key={item.key}>
              {index > 0 && <div className="mx-6 my-1 h-px bg-gray-100" />}

              <MenuItem>
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
              </MenuItem>
            </div>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
