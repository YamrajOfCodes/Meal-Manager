import { getAllOwners } from "../../types/SuperAdmin/superAdminAPI";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllOwners = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['owners'],
    queryFn: getAllOwners,
    onSuccess: (data) => {
      console.log('Owners fetched:', data);
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to fetch owners';

      if (error?.response?.status === 401) {
      } else {
      }
    },
  });
};


// export const useUpdateMessStatus = () => {
//     return useMutation({
//         mutationFn: updateMessStatus,

//         onSuccess: (data) => {
//           console.log(data);
//           queryClient.invalidateQueries({ queryKey: ['me'] });  
//     })
// }