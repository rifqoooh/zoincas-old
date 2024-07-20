'use server';

import { createClient } from '@/lib/supabase/auth/server';
import { sigInSchema, InferSigInSchema } from '@/lib/zod/auth-schema';
import { redirect } from 'next/navigation';

export async function actionSignUp(values: InferSigInSchema) {
  const supabase = createClient();

  // validate data
  const validateData = sigInSchema.parse(values);

  const response = await supabase.auth.signUp(validateData);

  // parse object to fix 'data is not a plain object'
  if (response.error) {
    response.error = JSON.parse(JSON.stringify(response.error));
    return response;
  }

  redirect('/');
}

export async function actionSignIn(values: InferSigInSchema) {
  const supabase = createClient();

  // validate data
  const validateData = sigInSchema.parse(values);

  const response = await supabase.auth.signInWithPassword(validateData);

  // parse object to fix 'data is not a plain object'
  if (response.error) {
    response.error = JSON.parse(JSON.stringify(response.error));
    return response;
  }

  redirect('/dashboard');
}

export async function actionSignOut() {
  const supabase = createClient();

  const response = await supabase.auth.signOut();

  // parse object to fix 'data is not a plain object'
  if (response.error) {
    response.error = JSON.parse(JSON.stringify(response.error));
    return response;
  }

  redirect('/');
}
