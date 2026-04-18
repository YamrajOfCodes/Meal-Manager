import toast from "react-hot-toast";
import { deleteMessOwner, getAllOwners, updateMessOwner, updateMessStatus } from "../../types/SuperAdmin/superAdminAPI";
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


export const useUpdateMessStatus = () => {
    const queryClient = useQueryClient();

     return useMutation({
    mutationKey: ['owners'],
    mutationFn: updateMessStatus,
    onSuccess: (data) => {
      console.log('Mess status updated:', data);
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
}


export const useUpdateMessOwner = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationKey: ['owners'],
    mutationFn: updateMessOwner,  
   
    onSuccess: (data) => {
      toast.success('Mess owner updated successfully');
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update mess owner';
  
  }})

}


export const useDeleteMessOwner = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationKey: ['owners'],
    mutationFn: deleteMessOwner,  
   
    onSuccess: (data) => {
      toast.success('Mess owner deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to delete mess owner';
  
  }})

}
