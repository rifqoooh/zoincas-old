import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await client.api['transactions']['$get']();

      if (!response.ok) {
        throw new Error('Failed to get data');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await client.api['transactions'][':id']['$get']({
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

export const useGetTransactionBudget = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transactionBudget', { id }],
    queryFn: async () => {
      const response = await client.api['transactions'][':id']['budget'][
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

export const useGetTransactionShopping = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transactionShopping', { id }],
    queryFn: async () => {
      const response = await client.api['transactions'][':id']['shopping'][
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

export const useGetAccountTransactions = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['accountTransactions', { id }],
    queryFn: async () => {
      const response = await client.api['transactions']['account'][':id'][
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

export const useGetBudgetPlanTransactions = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['budgetPlanTransactions', { id }],
    queryFn: async () => {
      const response = await client.api['transactions']['budget-plan'][':id'][
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

export const useCreateTransaction = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions']['$post']({ json });
      return await response.json();
    },
    onSuccess: ({ data }) => {
      const [{ accountId }] = data;
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: accountId }],
      });
    },
  });

  return mutation;
};

export const useCreateTransactionShopping = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions']['shopping-plan'][':id']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions']['shopping-plan'][':id']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions']['shopping-plan'][':id'][
        '$post'
      ]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: ({ data }) => {
      const [{ accountId }] = data;
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: accountId }],
      });
    },
  });

  return mutation;
};

export const useUpdateTransaction = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions'][':id']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions'][':id']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions'][':id']['$patch']({
        param: { id },
        json,
      });

      return await response.json();
    },
    onSuccess: ({ data }) => {
      const [{ accountId, prevAccountId }] = data;
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: prevAccountId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: accountId }],
      });
    },
  });

  return mutation;
};

export const useUpdateTransactionBudget = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions'][':id']['budget-category']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions'][':id']['budget-category']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions'][':id'][
        'budget-category'
      ]['$patch']({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transactionBudget', { id }],
      });
    },
  });

  return mutation;
};

export const useUpdateTransactionShopping = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions'][':id']['shopping-plan']['$patch']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions'][':id']['shopping-plan']['$patch']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions'][':id']['shopping-plan'][
        '$patch'
      ]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transactionShopping', { id }],
      });
    },
  });

  return mutation;
};

export const useDeleteTransactions = () => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions']['bulk-delete']['$post']
  >;
  type RequestType = InferRequestType<
    (typeof client.api)['transactions']['bulk-delete']['$post']
  >['json'];

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['transactions']['bulk-delete']['$post'](
        {
          json,
        }
      );
      return await response.json();
    },
    onSuccess: ({ data }) => {
      const [{ accountId }] = data;
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: accountId }],
      });
    },
  });

  return mutation;
};

export const useDeleteTransaction = (id?: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api)['transactions'][':id']['$delete']
  >;

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api['transactions'][':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: ({ data }) => {
      const [{ accountId }] = data;
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['accountTransactions', { id: accountId }],
      });
    },
  });

  return mutation;
};
