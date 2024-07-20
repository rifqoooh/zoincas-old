'use server';

import db from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/auth/server';
import { and, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import { shoppingItems, shoppingPlans } from '@/lib/supabase/schema';
import { InferShoppingItemSchema } from '@/lib/zod/shopping-item-schema';
import { calculateTotal } from '@/lib/utils';

const { shoppingPlanId, createdAt, ...shoppingItemsCols } =
  getTableColumns(shoppingItems);

export async function getShoppingPlanItems(id: string) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const planId = db.$with('plan_id').as(
    db
      .select({
        id: shoppingPlans.id,
      })
      .from(shoppingPlans)
      .where(
        and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingPlans.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(planId)
    .select({ ...shoppingItemsCols })
    .from(shoppingItems)
    .where(eq(shoppingItems.shoppingPlanId, sql`(select * from ${planId})`));

  return data;
}

export async function getShoppingPlanItem(id: string) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const itemId = db.$with('item_id').as(
    db
      .select({
        id: shoppingItems.id,
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .where(
        and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingItems.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(itemId)
    .select({ ...shoppingItemsCols })
    .from(shoppingItems)
    .where(eq(shoppingItems.id, sql`(select * from ${itemId})`))
    .limit(1);

  return data;
}

export async function createShoppingPlanItem(
  id: string,
  values: InferShoppingItemSchema
) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const { name, ...options } = values;
  const total = calculateTotal(options);

  const data = await db
    .insert(shoppingItems)
    .values({
      ...values,
      total,
      shoppingPlanId: id,
    })
    .returning({ ...shoppingItemsCols });

  return data;
}

export async function updateShoppingPlanItem(
  id: string,
  values: InferShoppingItemSchema
) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const { name, ...options } = values;
  const total = calculateTotal(options);

  // validate user id using CTE
  const itemId = db.$with('item_id').as(
    db
      .select({
        id: shoppingItems.id,
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .where(
        and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingItems.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(itemId)
    .update(shoppingItems)
    .set({
      ...values,
      total,
    })
    .where(eq(shoppingItems.id, sql`(select * from ${itemId})`))
    .returning({ ...shoppingItemsCols });

  return data;
}

export async function deleteShoppingPlanItems(ids: string[]) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const itemIds = db.$with('item_ids').as(
    db
      .select({
        id: shoppingItems.id,
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .where(
        and(
          eq(shoppingPlans.userId, auth.user.id),
          inArray(shoppingItems.id, ids)
        )
      )
  );

  const data = await db
    .with(itemIds)
    .delete(shoppingItems)
    .where(inArray(shoppingItems.id, sql`(select * from ${itemIds})`))
    .returning({ ...shoppingItemsCols });

  return data;
}

export async function deleteShoppingPlanItem(id: string) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const itemId = db.$with('item_id').as(
    db
      .select({
        id: shoppingItems.id,
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .where(
        and(eq(shoppingPlans.userId, auth.user.id), eq(shoppingItems.id, id))
      )
      .limit(1)
  );

  const data = await db
    .with(itemId)
    .delete(shoppingItems)
    .where(eq(shoppingItems.id, sql`(select * from ${itemId})`))
    .returning({ ...shoppingItemsCols });

  return data;
}
