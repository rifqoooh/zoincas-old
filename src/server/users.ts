'use server';

import db from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/auth/server';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/supabase/schema';

export async function getUser() {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select()
    .from(users)
    .where(eq(users.id, auth.user.id))
    .limit(1);

  return data;
}
