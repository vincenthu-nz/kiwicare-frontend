import { fetchOrderById } from '@/app/lib/data';
import ClientMapPage from '@/app/dashboard/orders/[id]/details/map-page';

export default async function Page({ params }: { params: any }) {
  const order = await fetchOrderById(params.id);
  return <ClientMapPage order={order} />;
}
