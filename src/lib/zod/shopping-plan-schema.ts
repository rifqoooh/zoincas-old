import { z } from 'zod';

export const shoppingPlanSchema = z.object({
  datetime: z.coerce.date().default(new Date()),
  title: z.string().min(1, { message: 'Shopping plan title is required' }),
});

export type InferShoppingPlanSchema = z.infer<typeof shoppingPlanSchema>;
export type InputShoppingPlanSchema = z.input<typeof shoppingPlanSchema>;
export type OutputShoppingPlanSchema = z.output<typeof shoppingPlanSchema>;
