import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCustomers } from "../../types/Admin/adminAPI";

export const useGetAllCustomers = (messCode) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['customers', messCode],
    queryFn: () => getAllCustomers({ messCode }),
    enabled: !!messCode,
    onSuccess: (data) => {
      console.log('Customers fetched:', data);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to fetch customers';

      if (error?.response?.status === 401) {
        // Handle unauthorized
      } else {
        // Handle other errors
      }
    },
  });
};