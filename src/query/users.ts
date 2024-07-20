import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetUser = () => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await client.api['users']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
