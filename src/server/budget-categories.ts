'use server';

import db from '@/lib/supabase/db';
import { and, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/auth/server';
import { budgetCategories, budgetPlans } from '@/lib/supabase/schema';
import { InferBudgetCategorySchema } from '@/lib/zod/budget-category-schema';
import { convertToMiliunits } from '@/lib/utils';

const { budgetPlanId, createdAt, ...budgetCategoriesCols } =
  getTableColumns(budgetCategories);

export async function getBudgetPlanCategories(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // get budget plan id and validate user id using CTE
  const planId = db.$with('plan_id').as(
    db
      .select({
        id: budgetPlans.id,
      })
      .from(budgetPlans)
      .where(and(eq(budgetPlans.userId, auth.user.id), eq(budgetPlans.id, id)))
      .limit(1)
  );

  const data = await db
    .with(planId)
    .select({ ...budgetCategoriesCols })
    .from(budgetCategories)
    .where(eq(budgetCategories.budgetPlanId, sql`(select * from ${planId})`));

  return data;
}

export async function getBudgetPlanCategory(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const categoryId = db.$with('category_id').as(
    db
      .select({
        id: budgetCategories.id,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .where(
        and(eq(budgetPlans.userId, auth.user.id), eq(budgetCategories.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(categoryId)
    .select({ ...budgetCategoriesCols })
    .from(budgetCategories)
    .where(eq(budgetCategories.id, sql`(select * from ${categoryId})`))
    .limit(1);

  return data;
}

export async function createBudgetPlanCategory(
  id: string,
  values: InferBudgetCategorySchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const parseAmount = convertToMiliunits(values.amount);

  const data = await db
    .insert(budgetCategories)
    .values({
      ...values,
      amount: parseAmount,
      budgetPlanId: id,
    })
    .returning({ ...budgetCategoriesCols });

  return data;
}

export async function updateBudgetPlanCategory(
  id: string,
  values: InferBudgetCategorySchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const categoryId = db.$with('category_id').as(
    db
      .select({
        id: budgetCategories.id,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .where(
        and(eq(budgetPlans.userId, auth.user.id), eq(budgetCategories.id, id))
      )
      .limit(1)
  );

  const parseAmount = convertToMiliunits(values.amount);

  const data = await db
    .with(categoryId)
    .update(budgetCategories)
    .set({ ...values, amount: parseAmount })
    .where(eq(budgetCategories.id, sql`(select * from ${categoryId})`))
    .returning({ ...budgetCategoriesCols });

  return data;
}

export async function deleteBudgetCategories(ids: string[]) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const itemIds = db.$with('item_ids').as(
    db
      .select({
        id: budgetCategories.id,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .where(
        and(
          eq(budgetPlans.userId, auth.user.id),
          inArray(budgetCategories.id, ids)
        )
      )
  );

  const data = await db
    .with(itemIds)
    .delete(budgetCategories)
    .where(inArray(budgetCategories.id, sql`(select * from ${itemIds})`))
    .returning({ ...budgetCategoriesCols });

  return data;
}

export async function deleteBudgetPlanCategory(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const categoryId = db.$with('category_id').as(
    db
      .select({
        id: budgetCategories.id,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .where(
        and(eq(budgetPlans.userId, auth.user.id), eq(budgetCategories.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(categoryId)
    .delete(budgetCategories)
    .where(eq(budgetCategories.id, sql`(select * from ${categoryId})`))
    .returning({ ...budgetCategoriesCols });

  return data;
}
