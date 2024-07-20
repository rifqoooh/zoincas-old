'use server';

import db from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/auth/server';
import { and, eq, count, sum, getTableColumns } from 'drizzle-orm';
import { coalesce } from '@/lib/utils';
import {
  shoppingItems,
  shoppingPlans,
  transactions,
} from '@/lib/supabase/schema';
import { InferShoppingPlanSchema } from '@/lib/zod/shopping-plan-schema';

const { userId, createdAt, ...shoppingPlansCols } =
  getTableColumns(shoppingPlans);

export async function getShoppingPlansSummary() {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryPlans = db.$with('summary_plans').as(
    db
      .select({
        id: shoppingPlans.id,
        count: count().as('count'),
        total: sum(shoppingItems.total).mapWith(Number).as('total'),
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .groupBy(shoppingPlans.id)
      .where(eq(shoppingPlans.userId, auth.user.id))
  );

  const data = await db
    .with(summaryPlans)
    .select({
      ...shoppingPlansCols,
      count: coalesce(summaryPlans.count, 0).mapWith(Number).as('count'),
      total: coalesce(summaryPlans.total, 0).mapWith(Number).as('total'),
      transactionId: transactions.id,
    })
    .from(shoppingPlans)
    .leftJoin(summaryPlans, eq(shoppingPlans.id, summaryPlans.id))
    .leftJoin(transactions, eq(shoppingPlans.id, transactions.shoppingPlanId))
    .where(eq(shoppingPlans.userId, auth.user.id));

  return data;
}

export async function getShoppingPlanSummary(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryPlans = db.$with('summary_plans').as(
    db
      .select({
        id: shoppingPlans.id,
        count: count().as('count'),
        total: sum(shoppingItems.total).mapWith(Number).as('total'),
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .groupBy(shoppingPlans.id)
      .where(
        and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
      )
  );

  const data = await db
    .with(summaryPlans)
    .select({
      ...shoppingPlansCols,
      count: coalesce(summaryPlans.count, 0).mapWith(Number).as('count'),
      total: coalesce(summaryPlans.total, 0).mapWith(Number).as('total'),
      transactionId: transactions.id,
    })
    .from(shoppingPlans)
    .leftJoin(summaryPlans, eq(shoppingPlans.id, summaryPlans.id))
    .leftJoin(transactions, eq(shoppingPlans.id, transactions.shoppingPlanId))
    .where(
      and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
    );

  return data;
}

export async function getShoppingPlan(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({ ...shoppingPlansCols })
    .from(shoppingPlans)
    .where(
      and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
    )
    .limit(1);

  return data;
}

export async function createShoppingPlan(values: InferShoppingPlanSchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const parseDate = new Date(values.datetime).toISOString();

  const data = await db
    .insert(shoppingPlans)
    .values({
      ...values,
      datetime: parseDate,
      userId: auth.user.id,
    })
    .returning({ ...shoppingPlansCols });

  return data;
}

export async function updateShoppingPlan(
  id: string,
  values: InferShoppingPlanSchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const parseDate = new Date(values.datetime).toISOString();

  const data = await db
    .update(shoppingPlans)
    .set({
      ...values,
      datetime: parseDate,
    })
    .where(
      and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
    )
    .returning({ shoppingPlansCols });

  return data;
}

export async function deleteShoppingPlan(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .delete(shoppingPlans)
    .where(
      and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
    )
    .returning({ ...shoppingPlansCols });

  return data;
}
