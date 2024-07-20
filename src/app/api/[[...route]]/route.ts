import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import users from './users';
import accounts from './accounts';
import categories from './categories';
import transactions from './transactions';
import shoppingPlans from './shopping-plans';
import shoppingItems from './shopping-items';
import budgetPlans from './budget-plans';
import budgetCategories from './budget-categories';
import summary from './summary';

// edge runtime did not work with supabase, return 'failed to compile'
// export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app
  .route('/users', users)
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)
  .route('/shopping-plans', shoppingPlans)
  .route('/shopping-items', shoppingItems)
  .route('/budget-plans', budgetPlans)
  .route('/budget-categories', budgetCategories)
  .route('/summary', summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
