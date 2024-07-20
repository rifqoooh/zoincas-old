import { z } from 'zod';

export const transactionSchema = z.object({
  datetime: z.coerce.date().default(new Date()),
  description: z.string().min(1, { message: 'Transaction name is required' }),
  amount: z.string().transform((value) => Number(value)),
  accountId: z.string().min(1, { message: 'Account is required' }),
  categoryId: z.string().nullable(),
});

export type InferTransactionSchema = z.infer<typeof transactionSchema>;
export type InputTransactionSchema = z.input<typeof transactionSchema>;
export type OutputTransactionSchema = z.output<typeof transactionSchema>;
