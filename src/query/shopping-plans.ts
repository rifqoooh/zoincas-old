import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetShoppingPlans = () => {
  const query = useQuery({
    queryKey: ['shoppingPlans'],
    queryFn: async () => {
      const response = await client.api['shopping-plans']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetShoppingPlan = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['shoppingPlan', { id }],
    queryFn: async () => {
      const response = await client.api['shopping-plans'][':id']['$get']({
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

export const useCreateShoppingPlan = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-plans']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['shopping-plans']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['shopping-plans']['$post']({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingPlans'] });
    },
  });

  return mutation;
};

export const useUpdateShoppingPlan = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-plans'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['shopping-plans'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['shopping-plans'][':id']['$patch']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingPlan', { id }] });
      queryClient.invalidateQueries({ queryKey: ['shoppingPlans'] });
    },
  });

  return mutation;
};

export const useDeleteShoppingPlan = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-plans'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['shopping-plans'][':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingPlan', { id }] });
      queryClient.invalidateQueries({ queryKey: ['shoppingPlans'] });
    },
  });

  return mutation;
};
