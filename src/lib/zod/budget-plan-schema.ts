import { z } from 'zod';

export const budgetPlanSchema = z.object({
  title: z.string().min(1, { message: 'Budget plan title is required' }),
});

export type InferBudgetPlanSchema = z.infer<typeof budgetPlanSchema>;
export type InputBudgetPlanSchema = z.input<typeof budgetPlanSchema>;
export type OutputBudgetPlanSchema = z.output<typeof budgetPlanSchema>;
