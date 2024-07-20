import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetBudgetCategories = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['budgetCategories', { id }],
    queryFn: async () => {
      const response = await client.api['budget-categories'][':id']['$get']({
        param: { id },
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

export const useGetBudgetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['budgetCategory', { id }],
    queryFn: async () => {
      const response = await client.api['budget-categories']['category'][':id'][
        '$get'
      ]({
        param: { id },
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

export const useCreateBudgetCategory = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-categories'][':id']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['budget-categories'][':id']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['budget-categories'][':id']['$post']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budgetPlansSummary'],
      });
    },
  });

  return mutation;
};

export const useUpdateBudgetCategory = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-categories']['category'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['budget-categories']['category'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['budget-categories']['category'][':id'][
        '$patch'
      ]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budgetPlansSummary'],
      });
      queryClient.invalidateQueries({
        queryKey: ['budgetCategory', { id }],
      });
    },
  });

  return mutation;
};

export const useDeleteBudgetCategories = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-categories']['bulk-delete']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['budget-categories']['bulk-delete']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['budget-categories']['bulk-delete'][
        '$post'
      ]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budgetPlansSummary'],
      });
    },
  });

  return mutation;
};

export const useDeleteBudgetCategory = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-categories']['category'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['budget-categories']['category'][':id'][
        '$delete'
      ]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budgetPlansSummary'],
      });
      queryClient.invalidateQueries({
        queryKey: ['budgetCategory', { id }],
      });
    },
  });

  return mutation;
};
