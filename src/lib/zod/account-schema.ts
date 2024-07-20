import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, { message: 'Account name is required' }),
  initialBalance: z.string().transform((value) => Number(value)),
});

export type InferAccountSchema = z.infer<typeof accountSchema>;
export type InputAccountSchema = z.input<typeof accountSchema>;
export type OutputAccountSchema = z.output<typeof accountSchema>;
