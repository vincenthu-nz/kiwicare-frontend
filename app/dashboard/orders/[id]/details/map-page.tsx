'use client';

import React, { Suspense } from 'react';
import MapboxMap from '@/app/ui/map/mapbox-map';
import { formatDateTimeToLocal } from '@/app/lib/utils';
import { OrdersTable } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';
import OrderStatus from "@/app/ui/orders/status";

export default function ClientMapPage({ order }: {order: OrdersTable}) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between pb-5">
        <h1 className={`${lusitana.className} text-2xl`}>Map Route</h1>
        <OrderStatus status={order.status}/>
      </div>

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <div className="h-[400px] w-full sm:h-[670px]">
          <Suspense fallback={<p>Loading...</p>}>
            <MapboxMap order={order}/>
          </Suspense>
        </div>

        <div className="z-10 grid grid-cols-2 gap-4 border-t bg-white p-4 md:grid-cols-4">
          <Info label="Service" value={order.service}/>
          <Info label="Origin(Provider Address)" value={order.provider_address}/>
          <Info label="Destination(Customer Address)" value={order.customer_address}/>
          <Info label="Customer" value={order.customer_name}/>
          <Info label="Start Time" value={formatDateTimeToLocal(order.date)}/>
          <Info
            label="Distance"
            value={
              `${(order.distance_m / 1000).toFixed(2)} km`
            }
          />
          <Info
            label={
              <>
                <span className="block md:hidden">
                  Est. Fee
                  <br/>
                  (Service + Travel)
                </span>
                <span className="hidden md:inline">
                  Est. Fee (Service + Travel)
                </span>
              </>
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
