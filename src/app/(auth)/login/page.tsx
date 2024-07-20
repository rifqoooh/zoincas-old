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
import { actionSignIn } from '@/server/auth';
import {
  sigInSchema,
  InputSigInSchema,
  OutputSigInSchema,
} from '@/lib/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function LoginPage() {
  // define form
  const { ...form } = useForm<InputSigInSchema, any, OutputSigInSchema>({
    resolver: zodResolver(sigInSchema),
    defaultValues: {
      email: 'demo259@zoincas.com',
      password: '12345678',
    },
  });

  const isLoading = form.formState.isSubmitting;

  // define submit handler
  const onSubmit: SubmitHandler<OutputSigInSchema> = async (values) => {
    toast.promise(async () => await actionSignIn(values), {
      loading: 'Logging in...',
      success: 'Logged in successfully',
      error: 'Failed to log in',
    });
  };

  return (
    <MaxWidthWrapper>
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Ready to dive in? Just pop in your email and password to access your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grip gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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

              <footer className="flex items-center py-6">
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </footer>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
