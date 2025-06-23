import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function UserStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        {
          'bg-green-500 text-white': status === 'active',
          'bg-gray-100 text-gray-600': status === 'pending',
          'bg-red-500 text-white': status === 'banned',
        },
      )}
    >
      {status === 'active' && (
        <>
          Active <CheckIcon className="ml-1 h-4 w-4" />
        </>
      )}
      {status === 'pending' && (
        <>
          Pending <ClockIcon className="ml-1 h-4 w-4" />
        </>
      )}
      {status === 'banned' && (
        <>
          Banned <XMarkIcon className="ml-1 h-4 w-4" />
        </>
      )}
    </span>
  );
}
