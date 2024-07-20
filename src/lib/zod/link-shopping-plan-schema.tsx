import { z } from 'zod';

export const linkShoppingPlanSchema = z.object({
  planId: z.string().min(1, { message: 'Account is required' }),
});

export type InferLinkShoppingPlanSchema = z.infer<
  typeof linkShoppingPlanSchema
>;
export type InputLinkShoppingPlanSchema = z.input<
  typeof linkShoppingPlanSchema
>;
export type OutputLinkShoppingPlanSchema = z.output<
  typeof linkShoppingPlanSchema
>;
