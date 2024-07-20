'use server';

import db from '@/lib/supabase/db';
import { and, eq, count, sum, getTableColumns } from 'drizzle-orm';
import { coalesce, convertToMiliunits } from '@/lib/utils';
import { createClient } from '@/lib/supabase/auth/server';
import { accounts, transactions } from '@/lib/supabase/schema';
import { InferAccountSchema } from '@/lib/zod/account-schema';

const { userId, createdAt, ...accountsCols } = getTableColumns(accounts);

export async function getAccounts() {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryAccounts = db.$with('summary_accounts').as(
    db
      .select({
        id: accounts.id,
        count: count().as('count'),
        total: sum(transactions.amount).mapWith(Number).as('total'),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .groupBy(accounts.id)
      .where(eq(accounts.userId, auth.user.id))
  );

  const data = await db
    .with(summaryAccounts)
    .select({
      ...accountsCols,
      count: coalesce(summaryAccounts.count, 0).mapWith(Number).as('count'),
      total: coalesce(summaryAccounts.total, 0).mapWith(Number).as('total'),
    })
    .from(accounts)
    .leftJoin(summaryAccounts, eq(accounts.id, summaryAccounts.id))
    .where(eq(accounts.userId, auth.user.id));

  return data;
}

export async function getAccount(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({ ...accountsCols })
    .from(accounts)
    .where(and(eq(accounts.userId, auth.user.id), eq(accounts.id, id)))
    .limit(1);

  return data;
}

export async function createAccount(values: InferAccountSchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const parseInitialBalance = convertToMiliunits(values.initialBalance);

  const data = await db
    .insert(accounts)
    .values({
      ...values,
      initialBalance: parseInitialBalance,
      userId: auth.user.id,
    })
    .returning({ ...accountsCols });

  return data;
}

export async function updateAccount(id: string, values: InferAccountSchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .update(accounts)
    .set({
      ...values,
      initialBalance: convertToMiliunits(values.initialBalance),
    })
    .where(and(eq(accounts.userId, auth.user.id), eq(accounts.id, id)))
    .returning({ ...accountsCols });

  return data;
}

export async function deleteAccount(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .delete(accounts)
    .where(and(eq(accounts.userId, auth.user.id), eq(accounts.id, id)))
    .returning({ ...accountsCols });

  return data;
}
