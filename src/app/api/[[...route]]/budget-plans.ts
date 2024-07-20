import { Hono } from 'hono';
import { supabaseMiddleware } from '@/lib/utils';
import * as R from 'remeda';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  getBudgetPlans,
  getBudgetPlansSummary,
  getBudgetPlan,
  createBudgetPlan,
  deleteBudgetPlan,
  updateBudgetPlan,
  getBudgetPlanCategories,
} from '@/server/budget-plans';
import { budgetPlanSchema } from '@/lib/zod/budget-plan-schema';

const app = new Hono()
  .get('/', supabaseMiddleware(), async (c) => {
    const data = await getBudgetPlans();

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
    zValidator('json', budgetPlanSchema),
    async (c) => {
      const values = c.req.valid('json');

      const data = await createBudgetPlan({
        title: values.title,
      });

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
  .get('/summary', supabaseMiddleware(), async (c) => {
    const data = await getBudgetPlansSummary();

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
  .get('/categories', supabaseMiddleware(), async (c) => {
    const data = await getBudgetPlanCategories();

    if (!data) {
      return c.json(
        {
          data: [],
          error: [{ message: 'The requested resource was not found' }],
        },
        404
      );
    }

    const newData = R.groupBy(data, R.prop('id'));

    return c.json(
      {
        data: newData,
        error: [],
      },
      200
    );
  })
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

      const data = await getBudgetPlan(id!);

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
    zValidator('json', budgetPlanSchema),
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

      const data = await updateBudgetPlan(id!, {
        title: values.title,
      });

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

      const data = await deleteBudgetPlan(id!);

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
