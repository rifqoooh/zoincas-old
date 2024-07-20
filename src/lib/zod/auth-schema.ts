import { z } from 'zod';

export const sigInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email must be valid' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const signUpSchema = sigInSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((value) => value.confirmPassword === value.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type InferSigInSchema = z.infer<typeof sigInSchema>;
export type InputSigInSchema = z.input<typeof sigInSchema>;
export type OutputSigInSchema = z.output<typeof sigInSchema>;

export type InferSignUpSchema = z.infer<typeof signUpSchema>;
export type InputSignUpSchema = z.input<typeof signUpSchema>;
export type OutputSignUpSchema = z.output<typeof signUpSchema>;
