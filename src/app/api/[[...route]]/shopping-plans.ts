import { supabaseMiddleware } from '@/lib/utils';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createShoppingPlan,
  deleteShoppingPlan,
  getShoppingPlan,
  getShoppingPlansSummary,
  updateShoppingPlan,
} from '@/server/shopping-plans';
import { shoppingPlanSchema } from '@/lib/zod/shopping-plan-schema';
import { z } from 'zod';

const app = new Hono()
  .get('/', supabaseMiddleware(), async (c) => {
    const data = await getShoppingPlansSummary();

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
    zValidator('json', shoppingPlanSchema),
    async (c) => {
      const values = c.req.valid('json');

      const data = await createShoppingPlan(values);

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

      const data = await getShoppingPlan(id!);

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
    zValidator('json', shoppingPlanSchema),
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

      const data = await updateShoppingPlan(id!, values);

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

      const data = await deleteShoppingPlan(id!);

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
