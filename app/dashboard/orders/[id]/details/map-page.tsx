'use client';

import React, { Suspense, useState } from 'react';
import MapboxMap from '@/app/ui/map/mapbox-map';
import { formatCurrency, formatDateTimeToLocal } from '@/app/lib/utils';
import { OrdersTable } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';

export default function ClientMapPage({ order }: { order: OrdersTable }) {
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col">
      <h1 className={`${lusitana.className} pb-5 text-2xl`}>Map Route</h1>

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <div className="h-[400px] w-full sm:h-[670px]">
          <Suspense fallback={<p>Loading...</p>}>
            <MapboxMap order={order} onDistanceCalculated={setDistanceKm} />
          </Suspense>
        </div>

        <div className="z-10 grid grid-cols-2 gap-4 border-t bg-white p-4 md:grid-cols-4">
          <Info label="Service" value={order.service} />
          <Info label="Origin" value={order.customer_location} />
          <Info label="Destination" value={order.provider_location} />
          <Info label="Customer" value={order.customer_name} />
          <Info label="Start Time" value={formatDateTimeToLocal(order.date)} />
          <Info
            label="Distance"
            value={
              distanceKm !== null
                ? `${distanceKm.toFixed(2)} km`
                : 'Calculating...'
            }
          />
          <Info
            label={
              <>
                <span className="block md:hidden">
                  Est. Fee
                  <br />
                  (Service + Travel)
                </span>
                <span className="hidden md:inline">
                  Est. Fee (Service + Travel)
                </span>
              </>
            }
            value={
              distanceKm !== null ? (
                <span>
                  <span className="text-sm text-gray-500">
                    {order.amount / 100} + {distanceKm.toFixed(2)} ={' '}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.amount + distanceKm * 100)}
                  </span>
                </span>
              ) : (
                'Calculating...'
              )
            }
          />
          <Info label="Provider" value={order.provider_name} />
        </div>
      </div>
    </div>
  );
}

function Info({
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
