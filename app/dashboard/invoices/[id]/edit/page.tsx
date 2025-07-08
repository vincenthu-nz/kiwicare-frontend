import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import { Metadata } from 'next';
import NotFound from "@/app/dashboard/invoices/[id]/edit/not-found";

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: {params: any}) {
  const id = params.id;

  if (!id) {
    return <NotFound title="Invoice ID is required"/>;
  }

  const [invoice, users] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    return <NotFound/>
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm invoice={invoice} users={users}/>
    </main>
  );
}
