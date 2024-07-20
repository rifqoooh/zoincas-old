'use server';

import db from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/auth/server';
import { count, sum, eq, and, getTableColumns } from 'drizzle-orm';
import { categories, transactions } from '@/lib/supabase/schema';
import { InferCategorySchema } from '@/lib/zod/category-schema';
import { coalesce } from '@/lib/utils';

const { userId, createdAt, ...categoriesCols } = getTableColumns(categories);

export async function getCategories() {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryCategories = await db.$with('summary_categories').as(
    db
      .select({
        id: categories.id,
        count: count().as('count'),
        total: sum(transactions.amount).mapWith(Number).as('total'),
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .groupBy(categories.id)
      .where(eq(categories.userId, auth.user.id))
  );

  const data = await db
    .with(summaryCategories)
    .select({
      ...categoriesCols,
      count: coalesce(summaryCategories.count, 0).mapWith(Number).as('count'),
      total: coalesce(summaryCategories.total, 0).mapWith(Number).as('total'),
    })
    .from(categories)
    .leftJoin(summaryCategories, eq(categories.id, summaryCategories.id))
    .where(eq(categories.userId, auth.user.id));

  return data;
}

export async function getCategory(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({ ...categoriesCols })
    .from(categories)
    .where(and(eq(categories.userId, auth.user.id), eq(categories.id, id)))
    .limit(1);

  return data;
}

export async function createCategory(values: InferCategorySchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .insert(categories)
    .values({
      ...values,
      userId: auth.user.id,
    })
    .returning({ ...categoriesCols });

  return data;
}

export async function updateCategory(id: string, values: InferCategorySchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .update(categories)
    .set(values)
    .where(and(eq(categories.userId, auth.user.id), eq(categories.id, id)))
    .returning({ ...categoriesCols });

  return data;
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .delete(categories)
    .where(and(eq(categories.userId, auth.user.id), eq(categories.id, id)))
    .returning({ ...categoriesCols });

  return data;
}
