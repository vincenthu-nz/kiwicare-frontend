import Image from 'next/image';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { getCurrentUserId } from '@/auth_token';
import { fetchFilteredOrders } from '@/app/lib/data';
import { Details } from '@/app/ui/orders/details';
import OrderStatus from "@/app/ui/orders/status";
import NotFound from "@/app/dashboard/invoices/[id]/edit/not-found";

export default async function OrdersTable(
  {
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
  const orders = await fetchFilteredOrders(query, currentPage);

  if (orders.length === 0) {
    return <NotFound/>;
  }

  const currentUserId = await getCurrentUserId() ?? '';

  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-2 md:pt-0">
      <div className="md:hidden">
        {orders.map((order) =>
          OrderCard(order, currentUserId)
        )}
      </div>

      <table className="hidden min-w-full text-gray-900 md:table">
        <thead className="text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Customer</th>
          <th scope="col" className="px-3 py-5 font-medium">Provider</th>
          <th scope="col" className="px-3 py-5 font-medium">Service</th>
          <th scope="col" className="px-3 py-5 font-medium">Amount</th>
          <th scope="col" className="px-3 py-5 font-medium">Date</th>
          <th scope="col" className="px-3 py-5 font-medium">Status</th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
        </thead>
        <tbody className="bg-white">
        {orders.map((order) =>
          OrderTableRow(order, currentUserId)
        )}
        </tbody>
      </table>
    </div>
  );
}

function OrderCard(order: any, currentUserId: string) {
  return (
    <div
      key={order.id}
      className="mb-4 w-full rounded-xl bg-white p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-gray-700">{order.service}</p>

      <hr className="my-3 border-gray-200"/>

      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Image
              src={order.customer_avatar}
              className="rounded-full"
              width={32}
              height={32}
              alt={`${order.customer_name}'s profile picture`}
            />
            <p className="flex items-center">
              {order.customer_name}
              {order.customer_id === currentUserId && (
                <span className="ml-1 text-sm font-semibold">(You)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Image
              src={order.provider_avatar}
              className="rounded-full"
              width={32}
              height={32}
              alt={`${order.provider_name}'s profile picture`}
            />
            <p className="flex items-center text-base text-gray-900">
              {order.provider_name}
              {order.provider_id === currentUserId && (
                <span className="ml-1 text-sm font-semibold text-gray-500">(You)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <OrderStatus status={order.status} paymentStatus={order.payment_status}/>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(order.total_amount)}
          </p>
          <p className="text-sm text-gray-500">
            {formatDateToLocal(order.date)}
          </p>
        </div>
        <div className="flex gap-2">
          <Details id={order.id}/>
        </div>
      </div>
    </div>
  );
}

function OrderTableRow(order: any, currentUserId: string) {
  return (
    <tr
      key={order.id}
      className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
    >
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <Image
            src={order.customer_avatar}
            className="rounded-full"
            width={28}
            height={28}
            alt={`${order.customer_name}'s profile picture`}
          />
          <p>
            {order.customer_name}
            {order.customer_id === currentUserId && (
              <span className="font-semibold">(You)</span>
            )}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={order.provider_avatar}
            className="rounded-full"
            width={32}
            height={32}
            alt={`${order.provider_name}'s profile picture`}
            loading="lazy"
            decoding="async"
          />
          <p className="flex items-center text-base text-gray-900">
            {order.provider_name}
            {order.provider_id === currentUserId && (
              <span className="ml-1 text-sm font-semibold text-gray-500">(You)</span>
            )}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">{order.service}</td>
      <td className="whitespace-nowrap px-3 py-3">
        {formatCurrency(order.total_amount)}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {formatDateToLocal(order.date)}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <OrderStatus status={order.status} paymentStatus={order.payment_status}/>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <Details id={order.id}/>
        </div>
      </td>
    </tr>
  );
}
