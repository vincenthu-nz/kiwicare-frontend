import { z } from 'zod';

export const InvoiceSchema = (idField: 'userId' | 'customerId') => {
  const shape: z.ZodRawShape = {
    [idField]: z.string({
      invalid_type_error: `Please select a ${idField === 'userId' ? 'user' : 'customer'}.`,
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
  };

  return z.object(shape);
};

// export const CreateInvoice = CreateFormSchema.omit({ id: true, date: true });
// export const UpdateInvoice = UpdateFormSchema.omit({ id: true, date: true });
