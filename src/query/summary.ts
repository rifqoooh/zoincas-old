import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useSearchParams } from 'next/navigation';

export const useGetSummary = () => {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const accountId = searchParams.get('accountId') || undefined;

  const query = useQuery({
    queryKey: ['summary', { startDate, endDate, accountId }],
    queryFn: async () => {
      const response = await client.api['summary']['$get']({
        query: {
          startDate,
          endDate,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
