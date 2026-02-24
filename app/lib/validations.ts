import { z } from 'zod';

/**
 * Builds a Zod schema for creating or updating an invoice form.
 *
 * The schema is dynamic because the create form references a `userId` (any
 * user can be billed), while the edit form references a `customerId` (the
 * order's customer). Passing the `idField` discriminator lets us generate a
 * single schema factory for both cases.
 *
 * @param idField - Which ID field to include: `'userId'` (create) or `'customerId'` (update).
 */
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
