import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    notFound();
  }

  const [invoice, users] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
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
      <EditInvoiceForm invoice={invoice} users={users} />
    </main>
  );
}
