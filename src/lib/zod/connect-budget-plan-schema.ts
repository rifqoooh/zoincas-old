import { z } from 'zod';

export const connectBudgetPlanSchema = z.object({
  planId: z.string().min(1, { message: 'Budget plan is required' }),
  categoryId: z.string().min(1, { message: 'Budget category is required' }),
});

export type InferConnectBudgetPlanSchema = z.infer<
  typeof connectBudgetPlanSchema
>;
export type InputConnectBudgetPlanSchema = z.input<
  typeof connectBudgetPlanSchema
>;
export type OutputConnectBudgetPlanSchema = z.output<
  typeof connectBudgetPlanSchema
>;
