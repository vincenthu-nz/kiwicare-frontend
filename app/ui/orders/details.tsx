import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function Details({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/orders/${id}/details`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ArrowRightIcon className="w-5" />
    </Link>
  );
}
