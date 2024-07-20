import { z } from 'zod';

export const budgetCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category is required' }),
  amount: z.string().transform((value) => Number(value)),
});

export type InferBudgetCategorySchema = z.infer<typeof budgetCategorySchema>;
export type InputBudgetCategorySchema = z.input<typeof budgetCategorySchema>;
export type OutputBudgetCategorySchema = z.output<typeof budgetCategorySchema>;
