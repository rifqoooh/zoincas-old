'use server';

import db from '@/lib/supabase/db';
import { and, eq, sum, desc, getTableColumns } from 'drizzle-orm';
import { coalesce, jsonAggBuildObject } from '@/lib/utils';
import { createClient } from '@/lib/supabase/auth/server';
import {
  transactions,
  budgetPlans,
  budgetCategories,
} from '@/lib/supabase/schema';
import { InferBudgetPlanSchema } from '@/lib/zod/budget-plan-schema';

const { userId, createdAt, ...budgetPlansCols } = getTableColumns(budgetPlans);

export async function getBudgetPlansSummary() {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const budgetCategoriesQuery = db.$with('budget_categories_query').as(
    db
      .select({
        id: budgetCategories.id,
        name: budgetCategories.name,
        amount: budgetCategories.amount,
        spend: coalesce(sum(transactions.amount), 0)
          .mapWith(Number)
          .as('spend'),
        budgetPlanId: budgetCategories.budgetPlanId,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .leftJoin(
        transactions,
        eq(budgetCategories.id, transactions.budgetCategoryId)
      )
      .where(eq(budgetPlans.userId, auth.user.id))
      .groupBy(budgetCategories.id)
  );

  const data = await db
    .with(budgetCategoriesQuery)
    .select({
      ...budgetPlansCols,
      total: coalesce(sum(budgetCategoriesQuery.amount), 0)
        .mapWith(Number)
        .as('total'),
      budgetCategories: jsonAggBuildObject(
        {
          id: budgetCategoriesQuery.id,
          name: budgetCategoriesQuery.name,
          amount: budgetCategoriesQuery.amount,
          spend: budgetCategoriesQuery.spend,
        },
        {
          orderBy: { colName: budgetCategoriesQuery.name, direction: 'ASC' },
          notNullColumn: 'id',
        }
      ),
    })
    .from(budgetPlans)
    .leftJoin(
      budgetCategoriesQuery,
      eq(budgetPlans.id, budgetCategoriesQuery.budgetPlanId)
    )
    .where(eq(budgetPlans.userId, auth.user.id))
    .groupBy(budgetPlans.id)
    .orderBy(desc(budgetPlans.createdAt));

  return data;
}

export async function getBudgetPlans() {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({ ...budgetPlansCols })
    .from(budgetPlans)
    .where(eq(budgetPlans.userId, auth.user.id));

  return data;
}

export async function getBudgetPlanCategories() {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({
      id: budgetPlans.id,
      categories: jsonAggBuildObject(
        {
          label: budgetCategories.name,
          value: budgetCategories.id,
        },
        {
          orderBy: { colName: budgetCategories.createdAt, direction: 'DESC' },
          notNullColumn: 'label',
        }
      ),
    })
    .from(budgetPlans)
    .innerJoin(
      budgetCategories,
      eq(budgetPlans.id, budgetCategories.budgetPlanId)
    )
    .where(eq(budgetPlans.userId, auth.user.id))
    .groupBy(budgetPlans.id);

  return data;
}

export async function getBudgetPlan(id: string) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({ ...budgetPlansCols })
    .from(budgetPlans)
    .where(and(eq(budgetPlans.userId, auth.user.id), eq(budgetPlans.id, id)))
    .limit(1);

  return data;
}

export async function createBudgetPlan(values: InferBudgetPlanSchema) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .insert(budgetPlans)
    .values({
      ...values,
      userId: auth.user.id,
    })
    .returning({ ...budgetPlansCols });

  return data;
}

export async function updateBudgetPlan(
  id: string,
  values: InferBudgetPlanSchema
) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .update(budgetPlans)
    .set(values)
    .where(and(eq(budgetPlans.userId, auth.user.id), eq(budgetPlans.id, id)))
    .returning({ ...budgetPlansCols });

  return data;
}

export async function deleteBudgetPlan(id: string) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = db
    .delete(budgetPlans)
    .where(and(eq(budgetPlans.userId, auth.user.id), eq(budgetPlans.id, id)))
    .returning({ ...budgetPlansCols });

  return data;
}
