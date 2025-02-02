'use server';

import { z } from 'zod';
import postgres from "postgres";
import * as process from "node:process";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId') as string,
        amount: Number(formData.get('amount')),
        status: formData.get('status') as 'pending' | 'paid',
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`INSERT INTO invoices (customer_id, amount, status, date)
                  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    } catch (error) {
        console.error('Database Error:', error);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId') as string,
        amount: Number(formData.get('amount')),
        status: formData.get('status') as 'pending' | 'paid',
    });

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId},
                amount      = ${amountInCents},
                status      = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Database Error:', error);
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // TODO: Need to delete this line
    throw new Error('Failed to Delete Invoice');

    await sql`DELETE
              FROM invoices
              WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}