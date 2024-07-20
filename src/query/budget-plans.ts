import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetBudgetPlans = () => {
  const query = useQuery({
    queryKey: ['budgetPlans'],
    queryFn: async () => {
      const response = await client.api['budget-plans']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetBudgetPlansSummary = () => {
  const query = useQuery({
    queryKey: ['budgetPlansSummary'],
    queryFn: async () => {
      const response = await client.api['budget-plans']['summary']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetBudgetPlanCategories = () => {
  const query = useQuery({
    queryKey: ['budgetPlanCategories'],
    queryFn: async () => {
      const response = await client.api['budget-plans']['categories']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetBudgetPlan = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['budgetPlan', { id }],
    queryFn: async () => {
      const response = await client.api['budget-plans'][':id']['$get']({
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

export const useCreateBudgetPlan = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-plans']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['budget-plans']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['budget-plans']['$post']({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetPlansSummary'] });
    },
  });

  return mutation;
};

export const useUpdateBudgetPlan = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-plans'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['budget-plans'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['budget-plans'][':id']['$patch']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetPlan', { id }] });
      queryClient.invalidateQueries({ queryKey: ['budgetPlansSummary'] });
    },
  });

  return mutation;
};

export const useDeleteBudgetPlan = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['budget-plans'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['budget-plans'][':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetPlan', { id }] });
      queryClient.invalidateQueries({ queryKey: ['budgetPlansSummary'] });
    },
  });

  return mutation;
};
