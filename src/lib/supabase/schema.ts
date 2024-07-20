import {
  uuid,
  varchar,
  integer,
  bigint,
  timestamp,
  index,
  pgTableCreator,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const pgTable = pgTableCreator((name) => `zoincas_${name}`);

// define drizzle schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  username: varchar('username', { length: 256 }),
  email: varchar('email', { length: 256 }),
});

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    initialBalance: bigint('initial_balance', { mode: 'number' })
      .default(0)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  // indexes
  (table) => {
    return {
      userAccountsIdx: index('user_accounts_idx').on(table.userId),
    };
  }
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 256 }).default('Untitled').notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userCategoriesIdx: index('user_categories_idx').on(table.userId),
    };
  }
);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    datetime: timestamp('datetime', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    description: varchar('description', { length: 256 })
      .default('Untitled')
      .notNull(),
    amount: bigint('amount', { mode: 'number' }).default(0).notNull(),
    accountId: uuid('account_id')
      .references(() => accounts.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    shoppingPlanId: uuid('shopping_plan_id').references(
      () => shoppingPlans.id,
      {
        onDelete: 'set null',
      }
    ),
    budgetCategoryId: uuid('budget_category_id').references(
      () => budgetCategories.id,
      {
        onDelete: 'set null',
      }
    ),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  // indexes
  (table) => {
    return {
      accountTransactionsIdx: index('account_transactions_idx').on(
        table.accountId
      ),
      shoppingPlanTransactionsIdx: index('shopping_plan_transactions_idx').on(
        table.shoppingPlanId
      ),
      budgetCategoryTransactionsIdx: index(
        'budget_category_transactions_idx'
      ).on(table.budgetCategoryId),
    };
  }
);

export const shoppingPlans = pgTable(
  'shopping_plans',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    datetime: timestamp('datetime', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    title: varchar('title', { length: 256 }).default('Untitled').notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userShoppingPlansIdx: index('user_shopping_plans_idx').on(table.userId),
    };
  }
);

export const shoppingItems = pgTable(
  'shopping_items',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('item', { length: 256 }).default('Untitled').notNull(),
    amount: bigint('amount', { mode: 'number' }).default(0).notNull(),
    quantity: integer('quantity').default(1).notNull(),
    discount: bigint('discount', { mode: 'number' }).default(0).notNull(),
    tax: bigint('tax', { mode: 'number' }).default(0).notNull(),
    total: bigint('total', { mode: 'number' }).default(0).notNull(),
    shoppingPlanId: uuid('shopping_plan_id')
      .references(() => shoppingPlans.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      shoppingPlanItemsIdx: index('shopping_plan_items_idx').on(
        table.shoppingPlanId
      ),
    };
  }
);

export const budgetPlans = pgTable(
  'budget_plans',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    title: varchar('title', { length: 256 }).default('Untitled').notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userBudgetPlansIdx: index('user_budget_plans_idx').on(table.userId),
    };
  }
);

export const budgetCategories = pgTable(
  'budget_categories',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 256 }).default('Uncategorized').notNull(),
    amount: bigint('amount', { mode: 'number' }).default(0).notNull(),
    budgetPlanId: uuid('budget_plan_id')
      .references(() => budgetPlans.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => {
    return {
      budgetPlanCategoriesIdx: index('budget_plan_categories_idx').on(
        table.budgetPlanId
      ),
    };
  }
);

// define drizzle relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  categories: many(categories),
  shoppingPlans: many(shoppingPlans),
  budgetPlans: many(budgetPlans),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  userId: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  userId: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  categoryId: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  accountId: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  shoppingPlanId: one(shoppingPlans, {
    fields: [transactions.shoppingPlanId],
    references: [shoppingPlans.id],
  }),
  budgetCategoryId: one(budgetCategories, {
    fields: [transactions.budgetCategoryId],
    references: [budgetCategories.id],
  }),
}));

export const shoppingPlansRelations = relations(
  shoppingPlans,
  ({ one, many }) => ({
    userId: one(users, {
      fields: [shoppingPlans.userId],
      references: [users.id],
    }),
    transactions: one(transactions),
    shoppingItems: many(shoppingItems),
  })
);

export const shoppingItemRelations = relations(shoppingItems, ({ one }) => ({
  shoppingPlanId: one(shoppingPlans, {
    fields: [shoppingItems.shoppingPlanId],
    references: [shoppingPlans.id],
  }),
}));

export const budgetPlansRelations = relations(budgetPlans, ({ one, many }) => ({
  userId: one(users, {
    fields: [budgetPlans.userId],
    references: [users.id],
  }),
  budgetCategories: many(budgetCategories),
}));

export const budgetCategoriesRelations = relations(
  budgetCategories,
  ({ one, many }) => ({
    budgetPlanId: one(budgetPlans, {
      fields: [budgetCategories.budgetPlanId],
      references: [budgetPlans.id],
    }),
    transactions: many(transactions),
  })
);
