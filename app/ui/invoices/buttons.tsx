import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { ConfirmModal } from '@/app/ui/confirm-modal';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:mr-2" />
      <span className="hidden md:block">Create Invoice</span>
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceById = deleteInvoice.bind(null, id);

  return (
    <ConfirmModal
      trigger={
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <TrashIcon className="w-5" />
        </button>
      }
      title="Delete Invoice"
      description="This action cannot be undone."
    >
      <form action={deleteInvoiceById}>
        <button
          type="submit"
          className="rounded border border-red-500 px-3 py-1 text-sm text-red-500 hover:bg-red-100"
        >
          <TrashIcon className="w-5" />
        </button>
      </form>
    </ConfirmModal>
  );
}
