import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseMiddleware } from '@/lib/utils';
import { budgetCategorySchema } from '@/lib/zod/budget-category-schema';
import {
  createBudgetPlanCategory,
  deleteBudgetCategories,
  deleteBudgetPlanCategory,
  getBudgetPlanCategories,
  getBudgetPlanCategory,
  updateBudgetPlanCategory,
} from '@/server/budget-categories';

const app = new Hono()
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

      const data = await getBudgetPlanCategories(id!);

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
    '/bulk-delete',
    supabaseMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.string().array(),
      })
    ),
    async (c) => {
      const { ids } = c.req.valid('json');

      const data = await deleteBudgetCategories(ids);

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
      budgetCategorySchema.extend({
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

      const data = await createBudgetPlanCategory(id!, values);

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
  .get(
    '/category/:id',
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

      const data = await getBudgetPlanCategory(id!);

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
    '/category/:id',
    supabaseMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      'json',
      budgetCategorySchema.extend({
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

      const data = await updateBudgetPlanCategory(id!, values);

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
    '/category/:id',
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

      const data = await deleteBudgetPlanCategory(id!);

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
