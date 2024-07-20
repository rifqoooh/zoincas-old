import { InferResponseType, InferRequestType } from 'hono';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await client.api['categories']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await client.api['categories'][':id']['$get']({
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

export const useCreateCategory = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['categories']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['categories']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['categories']['$post']({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return mutation;
};

export const useUpdateCategory = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['categories'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['categories'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['categories'][':id']['$patch']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return mutation;
};

export const useDeleteCategory = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['categories'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['categories'][':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return mutation;
};
