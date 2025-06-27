import Search from '@/app/ui/search';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import InvoicesTable from '@/app/ui/invoices/table';
import { fetchInvoicesPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Invoices | KiwiCare Dashboard',
};

export default async function Page(props: any) {
  const { searchParams } = props;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>

      <div className="mt-4 flex justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
