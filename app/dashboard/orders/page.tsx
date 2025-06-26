import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { fetchOrdersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import OrdersTable from '@/app/ui/orders/table';

export const metadata: Metadata = {
  title: 'Orders | KiwiCare Dashboard',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchOrdersPages(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>

      <div className="mt-4 flex justify-between gap-2 md:mt-8">
        <Search placeholder="Search orders..." />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <OrdersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
