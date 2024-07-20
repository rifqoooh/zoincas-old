import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseMiddleware } from '@/lib/utils';
import { categorySchema } from '@/lib/zod/category-schema';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/server/categories';

const app = new Hono()
  .get('/', supabaseMiddleware(), async (c) => {
    const data = await getCategories();

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
    zValidator('json', categorySchema),
    async (c) => {
      const values = c.req.valid('json');

      const data = await createCategory(values);

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

      const data = await getCategory(id!);

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
    zValidator('json', categorySchema),
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

      const data = await updateCategory(id!, values);

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

      const data = await deleteCategory(id!);

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
