import { z } from 'zod';

export const shoppingItemSchema = z.object({
  name: z.string().min(1, { message: 'Name is requeired' }),
  amount: z.string().transform((value) => Number(value)),
  quantity: z.string().transform((value) => Number(value)),
  discount: z.string().transform((value) => Number(value)),
  tax: z.string().transform((value) => Number(value)),
});

export type InferShoppingItemSchema = z.infer<typeof shoppingItemSchema>;
export type InputShoppingItemSchema = z.input<typeof shoppingItemSchema>;
export type OutputShoppingItemSchema = z.output<typeof shoppingItemSchema>;
