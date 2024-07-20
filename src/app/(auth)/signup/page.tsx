'use client';

import { toast } from 'sonner';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { actionSignUp } from '@/server/auth';
import {
  signUpSchema,
  InputSignUpSchema,
  OutputSignUpSchema,
} from '@/lib/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function SignupPage() {
  // define form
  const { ...form } = useForm<InputSignUpSchema, any, OutputSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  // define submit handler
  const onSubmit: SubmitHandler<OutputSignUpSchema> = async (values) => {
    toast.promise(async () => await actionSignUp(values), {
      loading: 'Creating account...',
      success: 'Account created successfully',
      error: 'Failed to create account',
    });
  };

  return (
    <MaxWidthWrapper>
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Let&apos;s get you started! Simply share your details to set up your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isLoading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <footer className="flex items-center py-6">
                <Button className="w-full">
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </footer>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
