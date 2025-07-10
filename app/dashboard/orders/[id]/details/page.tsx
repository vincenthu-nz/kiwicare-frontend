import { fetchOrderById } from '@/app/lib/data';
import { Metadata } from 'next';
import { lusitana } from "@/app/ui/fonts";
import OrderStatus from "@/app/ui/orders/status";
import React, { Suspense } from "react";
import MapboxMap from "@/app/ui/map/mapbox-map";
import { formatDateToLocal } from "@/app/lib/utils";
import NotFound from "@/app/dashboard/invoices/[id]/edit/not-found";

export const metadata: Metadata = {
  title: 'Order Details',
};

export default async function Page({ params }: {params: any}) {
  const { order, reviews } = await fetchOrderById(params.id);

  if (!order) {
    return <NotFound/>;
  }

  const customerReview = reviews.find((r) => r.authorRole === 'customer');
  const providerReview = reviews.find((r) => r.authorRole === 'provider');

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between pb-5">
        <h1 className={`${lusitana.className} text-2xl`}>Map Route</h1>
        <OrderStatus status={order.status} paymentStatus={order.payment_status}/>
      </div>

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <div className="h-[400px] w-full sm:h-[670px]">
          <Suspense fallback={<p className="p-4">Loading...</p>}>
            <MapboxMap order={order}/>
          </Suspense>
        </div>

        <div className="z-10 grid grid-cols-2 gap-4 border-t bg-white p-4 md:grid-cols-4">
          <Info label="Service" value={order.service}/>
          <Info label="Origin(Provider Address)" value={order.provider_address}/>
          <Info label="Destination(Customer Address)" value={order.customer_address}/>
          <Info label="Customer" value={order.customer_name}/>
          <Info label="Start Time" value={formatDateToLocal(order.date, true)}/>
          <Info
            label="Distance"
            value={
              `${(order.distance_m / 1000).toFixed(2)} km`
            }
          />
          <Info
            label={
              <span className="hidden md:inline">
                  Est. Fee(Service + Travel)
              </span>
            }
            value={
              <span>
                <span className="text-sm text-gray-500">
                  {order.service_fee / 100} + {order.travel_fee / 100} ={' '}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ${order.service_fee / 100 + order.travel_fee / 100}
                </span>
              </span>
            }
          />
          <Info label="Provider" value={order.provider_name}/>
        </div>

        <ReviewCard
          title="Customer Review"
          review={customerReview}
        />
        <ReviewCard
          title="Provider Review"
          review={providerReview}
        />
      </div>
    </div>
  );
}

function Info(
  {
    label,
    value,
  }: {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
  }): React.ReactElement {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ReviewCard(
  {
    title,
    review,
  }: {
    title: string;
    review?: {authorRole: string; rating: number; comment: string | null};
  }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {review ? (
        <>
          <StarRating rating={review.rating}/>
          <p className="mt-3 text-gray-700">{review.comment || 'No comment provided.'}</p>
        </>
      ) : (
        <p className="text-gray-400">No review yet.</p>
      )}
    </div>
  );
}

function StarRating({ rating }: {rating: number}) {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="inline-block">
          <svg
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.83 1.475 8.254L12 18.897l-7.411 4.493 1.475-8.254-6.064-5.83 8.332-1.151z"/>
          </svg>
        </span>
      ))}
    </div>
  );
}
