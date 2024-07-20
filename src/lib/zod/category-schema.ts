import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
});

export type InferCategorySchema = z.infer<typeof categorySchema>;
export type InputCategorySchema = z.input<typeof categorySchema>;
export type OutputCategorySchema = z.output<typeof categorySchema>;
