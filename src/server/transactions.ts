'use server';

import db from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/auth/server';
import {
  and,
  eq,
  inArray,
  sum,
  sql,
  desc,
  getTableColumns,
  gte,
  lte,
  lt,
} from 'drizzle-orm';
import {
  accounts,
  transactions,
  categories,
  budgetPlans,
  budgetCategories,
  shoppingPlans,
  shoppingItems,
} from '@/lib/supabase/schema';
import { format } from 'date-fns';
import { InferTransactionSchema } from '@/lib/zod/transaction-schema';
import { coalesce, convertToMiliunits } from '@/lib/utils';
import { InferConnectBudgetPlanSchema } from '@/lib/zod/connect-budget-plan-schema';
import { InferLinkShoppingPlanSchema } from '@/lib/zod/link-shopping-plan-schema';
import { getShoppingPlanSummary } from './shopping-plans';

const { accountId, categoryId, createdAt, ...transactionsCols } =
  getTableColumns(transactions);

function summaryPlansCTE(userId: string) {
  return db.$with('summary_plans').as(
    db
      .select({
        id: shoppingPlans.id,
        total: sum(shoppingItems.total).mapWith(Number).as('total'),
      })
      .from(shoppingItems)
      .innerJoin(
        shoppingPlans,
        eq(shoppingItems.shoppingPlanId, shoppingPlans.id)
      )
      .groupBy(shoppingPlans.id)
      .where(eq(shoppingPlans.userId, userId))
  );
}

export async function getTransactions() {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryPlans = summaryPlansCTE(auth.user.id);

  const data = await db
    .with(summaryPlans)
    .select({
      ...transactionsCols,
      account: accounts.name,
      category: categories.name,
      budgetCategory: budgetCategories.name,
      shoppingPlanAmount: coalesce(summaryPlans.total, 0)
        .mapWith(Number)
        .as('total'),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .leftJoin(
      budgetCategories,
      eq(transactions.budgetCategoryId, budgetCategories.id)
    )
    .leftJoin(shoppingPlans, eq(transactions.shoppingPlanId, shoppingPlans.id))
    .leftJoin(summaryPlans, eq(shoppingPlans.id, summaryPlans.id))
    .where(eq(accounts.userId, auth.user.id))
    .orderBy(desc(transactions.datetime));

  return data;
}

export async function getTransaction(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionId = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.user.id), eq(transactions.id, id)))
      .limit(1)
  );

  const data = await db
    .with(transactionId)
    .select({
      ...transactionsCols,
      accountId,
      categoryId,
    })
    .from(transactions)
    .where(eq(transactions.id, sql`(select * from ${transactionId})`))
    .limit(1);

  return data;
}

export async function getAccountTransactions(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryPlans = summaryPlansCTE(auth.user.id);

  const data = await db
    .with(summaryPlans)
    .select({
      ...transactionsCols,
      account: accounts.name,
      category: categories.name,
      budgetCategory: budgetCategories.name,
      shoppingPlanAmount: coalesce(summaryPlans.total, 0)
        .mapWith(Number)
        .as('total'),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .leftJoin(
      budgetCategories,
      eq(transactions.budgetCategoryId, budgetCategories.id)
    )
    .leftJoin(shoppingPlans, eq(transactions.shoppingPlanId, shoppingPlans.id))
    .leftJoin(summaryPlans, eq(shoppingPlans.id, summaryPlans.id))
    .where(
      and(eq(accounts.userId, auth.user.id), eq(transactions.accountId, id))
    )
    .orderBy(desc(transactions.datetime));

  return data;
}

export async function getBudgetPlanTransactions(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const summaryPlans = summaryPlansCTE(auth.user.id);

  const budgetCategoryIds = db.$with('budget_category_ids').as(
    db
      .select({
        id: budgetCategories.id,
      })
      .from(budgetCategories)
      .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
      .where(and(eq(budgetPlans.userId, auth.user.id), eq(budgetPlans.id, id)))
  );

  const data = await db
    .with(budgetCategoryIds, summaryPlans)
    .select({
      ...transactionsCols,
      account: accounts.name,
      category: categories.name,
      budgetCategory: budgetCategories.name,
      shoppingPlanAmount: coalesce(summaryPlans.total, 0)
        .mapWith(Number)
        .as('total'),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .leftJoin(
      budgetCategories,
      eq(transactions.budgetCategoryId, budgetCategories.id)
    )
    .leftJoin(shoppingPlans, eq(transactions.shoppingPlanId, shoppingPlans.id))
    .leftJoin(summaryPlans, eq(shoppingPlans.id, summaryPlans.id))
    .where(
      inArray(
        transactions.budgetCategoryId,
        sql`(select * from ${budgetCategoryIds})`
      )
    )
    .orderBy(desc(transactions.datetime));

  return data;
}

export async function getTransactionBudget(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({
      planId: budgetPlans.id,
      categoryId: transactions.budgetCategoryId,
    })
    .from(transactions)
    .innerJoin(
      budgetCategories,
      eq(transactions.budgetCategoryId, budgetCategories.id)
    )
    .innerJoin(budgetPlans, eq(budgetCategories.budgetPlanId, budgetPlans.id))
    .where(eq(transactions.id, id));

  return data;
}

export async function getTransactionShopping(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const data = await db
    .select({
      accountId: transactions.accountId,
    })
    .from(transactions)
    .where(eq(transactions.shoppingPlanId, id));

  return data;
}

export async function getIncomeExpenseSummary(options: {
  startDate: Date;
  endDate: Date;
  accountId?: string;
}) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionIds = db.$with('transaction_ids').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          options.accountId
            ? eq(transactions.accountId, options.accountId)
            : undefined,
          eq(accounts.userId, auth.user.id),
          gte(transactions.datetime, format(options.startDate, 'MM/dd/yyyy')),
          lte(transactions.datetime, format(options.endDate, 'MM/dd/yyyy'))
        )
      )
  );

  const data = await db
    .with(transactionIds)
    .select({
      income: coalesce(
        sum(
          sql`case when ${transactions.amount} > 0 then ${transactions.amount} else 0 end`
        ),
        0
      )
        .mapWith(Number)
        .as('income'),
      expense: coalesce(
        sum(
          sql`case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end`
        ),
        0
      )
        .mapWith(Number)
        .as('expense'),
      remaining: coalesce(sum(transactions.amount), 0)
        .mapWith(Number)
        .as('remaining'),
    })
    .from(transactions)
    .where(inArray(transactions.id, sql`(select * from ${transactionIds})`));

  return data;
}

export async function getCategorySummary(options: {
  startDate: Date;
  endDate: Date;
  accountId?: string;
}) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionIds = db.$with('transaction_ids').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          options.accountId
            ? eq(transactions.accountId, options.accountId)
            : undefined,
          eq(accounts.userId, auth.user.id),
          lt(transactions.amount, 0),
          gte(transactions.datetime, format(options.startDate, 'MM/dd/yyyy')),
          lte(transactions.datetime, format(options.endDate, 'MM/dd/yyyy'))
        )
      )
  );

  const data = await db
    .with(transactionIds)
    .select({
      name: categories.name,
      amount: sum(sql`abs(${transactions.amount})`)
        .mapWith(Number)
        .as('amount'),
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(inArray(transactions.id, sql`(select * from ${transactionIds})`))
    .groupBy(categories.name)
    .orderBy(desc(sql`amount`));

  return data;
}

export async function getIncomeExpenseSummaryByDate(options: {
  startDate: Date;
  endDate: Date;
  accountId?: string;
}) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionIds = db.$with('transaction_ids').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          options.accountId
            ? eq(transactions.accountId, options.accountId)
            : undefined,
          eq(accounts.userId, auth.user.id),
          gte(transactions.datetime, format(options.startDate, 'MM/dd/yyyy')),
          lte(transactions.datetime, format(options.endDate, 'MM/dd/yyyy'))
        )
      )
  );

  const data = await db
    .with(transactionIds)
    .select({
      date: sql`date(${transactions.datetime})`.mapWith(String).as('date'),
      income: sum(
        sql`case when ${transactions.amount} > 0 then ${transactions.amount} else 0 end`
      )
        .mapWith(Number)
        .as('income'),
      expense: sum(
        sql`case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end`
      )
        .mapWith(Number)
        .as('expense'),
    })
    .from(transactions)
    .where(inArray(transactions.id, sql`(select * from ${transactionIds})`))
    .groupBy(sql`date`)
    .orderBy(sql`date`);

  return data;
}

export async function createTransaction(values: InferTransactionSchema) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const parseDate = new Date(values.datetime).toISOString();
  const parseAmount = convertToMiliunits(values.amount);

  const data = await db
    .insert(transactions)
    .values({
      ...values,
      datetime: parseDate,
      amount: parseAmount,
    })
    .returning({ ...transactionsCols, accountId });

  return data;
}

export async function createTransactionShopping(
  id: string,
  values: InferLinkShoppingPlanSchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  const [plan] = await getShoppingPlanSummary(id);

  if (!plan) throw new Error('Failed to do the request');

  const parsedDate = new Date(plan.datetime).toISOString();

  const data = await db
    .insert(transactions)
    .values({
      datetime: parsedDate,
      description: plan.title,
      accountId: values.planId,
      shoppingPlanId: id,
    })
    .returning({ ...transactionsCols, accountId });

  return data;
}

export async function updateTransaction(
  id: string,
  values: InferTransactionSchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionId = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.user.id), eq(transactions.id, id)))
      .limit(1)
  );

  const parseAmount = convertToMiliunits(values.amount);
  const parseDate = new Date(values.datetime).toISOString();

  const data = await db
    .with(transactionId)
    .update(transactions)
    .set({
      ...values,
      amount: parseAmount,
      datetime: parseDate,
    })
    .where(eq(transactions.id, sql`(select * from ${transactionId})`))
    .returning({ ...transactionsCols, accountId });

  return data;
}

export async function updateTransactionBudget(
  id: string,
  values: InferConnectBudgetPlanSchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionId = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.user.id), eq(transactions.id, id)))
      .limit(1)
  );

  const data = await db
    .with(transactionId)
    .update(transactions)
    .set({
      budgetCategoryId: values.categoryId,
    })
    .where(eq(transactions.id, sql`(select * from ${transactionId})`))
    .returning({ ...transactionsCols });

  return data;
}

export async function updateTransactionShopping(
  id: string,
  values: InferLinkShoppingPlanSchema
) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionId = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.user.id), eq(transactions.id, id)))
      .limit(1)
  );

  const data = await db
    .with(transactionId)
    .update(transactions)
    .set({
      shoppingPlanId: values.planId,
    })
    .where(eq(transactions.id, sql`(select * from ${transactionId})`))
    .returning({ ...transactionsCols });

  return data;
}

export async function deleteTransactions(ids: string[]) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionIds = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(eq(accounts.userId, auth.user.id), inArray(transactions.id, ids))
      )
  );

  const data = await db
    .with(transactionIds)
    .delete(transactions)
    .where(inArray(transactions.id, sql`(select * from ${transactionIds})`))
    .returning({ ...transactionsCols, accountId });

  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) throw new Error('Unauthorized');

  // validate user id using CTE
  const transactionId = db.$with('transaction_id').as(
    db
      .select({
        id: transactions.id,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.user.id), eq(transactions.id, id)))
      .limit(1)
  );

  const data = await db
    .with(transactionId)
    .delete(transactions)
    .where(eq(transactions.id, sql`(select * from ${transactionId})`))
    .returning({ ...transactionsCols, accountId });

  return data;
}
