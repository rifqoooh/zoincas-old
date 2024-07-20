import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetShoppingItems = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['shoppingItems'],
    queryFn: async () => {
      const response = await client.api['shopping-items'][':id']['$get']({
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

export const useGetShoppingItem = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['shoppingItem', { id }],
    queryFn: async () => {
      const response = await client.api['shopping-items']['item'][':id'][
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

export const useCreateShoppingItem = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-items'][':id']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['shopping-items'][':id']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['shopping-items'][':id']['$post']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shoppingItems'],
      });
    },
  });

  return mutation;
};

export const useUpdateShoppingItem = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-items']['item'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['shopping-items']['item'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['shopping-items']['item'][':id'][
        '$patch'
      ]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shoppingItems'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shoppingItem', { id }],
      });
    },
  });

  return mutation;
};

export const useDeleteShoppingItems = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-items']['bulk-delete']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['shopping-items']['bulk-delete']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['shopping-items']['bulk-delete'][
        '$post'
      ]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shoppingItems'],
      });
    },
  });

  return mutation;
};

export const useDeleteShoppingItem = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['shopping-items']['item'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['shopping-items']['item'][':id'][
        '$delete'
      ]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shoppingItems'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shoppingItem', { id }],
      });
    },
  });

  return mutation;
};
