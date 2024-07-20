import { Hono } from 'hono';
import { supabaseMiddleware } from '@/lib/utils';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import {
  deleteTransactions,
  getTransaction,
  getTransactions,
  getAccountTransactions,
  getBudgetPlanTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionBudget,
  getTransactionBudget,
  getTransactionShopping,
  updateTransactionShopping,
  createTransactionShopping,
  getIncomeExpenseSummary,
} from '@/server/transactions';
import { transactionSchema } from '@/lib/zod/transaction-schema';
import { connectBudgetPlanSchema } from '@/lib/zod/connect-budget-plan-schema';
import { linkShoppingPlanSchema } from '@/lib/zod/link-shopping-plan-schema';

const app = new Hono()
  .get('/', supabaseMiddleware(), async (c) => {
    const data = await getTransactions();

    if (!data) {
      return c.json(
        {
          data: [],
          error: [{ message: 'The requested resource was not found' }],
        },
        404
      );
    }

    return c.json(
      {
        data: data,
        error: [],
      },
      200
    );
  })
  .post(
    '/',
    supabaseMiddleware(),
    zValidator(
      'json',
      transactionSchema.extend({
        amount: z.coerce.number(),
      })
    ),
    async (c) => {
      const values = c.req.valid('json');

      const data = await createTransaction(values);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        201
      );
    }
  )
  .post(
    '/bulk-delete',
    supabaseMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.string().array(),
      })
    ),
    async (c) => {
      const values = c.req.valid('json');

      const data = await deleteTransactions(values.ids);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .post(
    '/shopping-plan/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator('json', linkShoppingPlanSchema),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      const data = await createTransactionShopping(id!, values);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .get('/summary', supabaseMiddleware(), async (c) => {
    const data = await getIncomeExpenseSummary();

    if (!data) {
      return c.json(
        {
          data: [],
          error: [{ message: 'The requested resource was not found' }],
        },
        404
      );
    }

    return c.json(
      {
        data: data,
        error: [],
      },
      200
    );
  })
  .get(
    '/account/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await getAccountTransactions(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .get(
    '/budget-plan/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await getBudgetPlanTransactions(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .get(
    '/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await getTransaction(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .get(
    '/:id/budget',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await getTransactionBudget(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .get(
    '/:id/shopping',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await getTransactionShopping(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .patch(
    '/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      'json',
      transactionSchema.extend({
        amount: z.coerce.number(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      const [{ accountId: prevAccountId }] = await getTransaction(id!);

      if (!prevAccountId) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      const [data] = await updateTransaction(id!, values);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: [{ ...data, prevAccountId }],
          error: [],
        },
        200
      );
    }
  )
  .patch(
    '/:id/budget-category',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator('json', connectBudgetPlanSchema),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      const data = await updateTransactionBudget(id!, values);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .patch(
    '/:id/shopping-plan',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator('json', linkShoppingPlanSchema),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      const data = await updateTransactionShopping(id!, values);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  )
  .delete(
    '/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c, next) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json(
          {
            data: [],
            error: [{ message: 'A required parameter is missing' }],
          },
          400
        );
      }

      await next();
    },
    async (c) => {
      const { id } = c.req.valid('param');

      const data = await deleteTransaction(id!);

      if (!data) {
        return c.json(
          {
            data: [],
            error: [{ message: 'The requested resource was not found' }],
          },
          404
        );
      }

      return c.json(
        {
          data: data,
          error: [],
        },
        200
      );
    }
  );
export default app;
