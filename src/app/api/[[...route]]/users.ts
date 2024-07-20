import { Hono } from 'hono';
import { supabaseMiddleware } from '@/lib/utils';
import { getUser } from '@/server/users';

const app = new Hono().get('/', supabaseMiddleware(), async (c) => {
  const data = await getUser();

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
});

export default app;
