import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await client.api['accounts']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['account', { id }],
    queryFn: async () => {
      const response = await client.api['accounts'][':id']['$get']({
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

export const useCreateAccount = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['accounts']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['accounts']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['accounts']['$post']({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return mutation;
};

export const useUpdateAccount = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['accounts'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['accounts'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['accounts'][':id']['$patch']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return mutation;
};

export const useDeleteAccount = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['accounts'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['accounts'][':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return mutation;
};
