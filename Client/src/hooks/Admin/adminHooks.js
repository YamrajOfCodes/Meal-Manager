import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMenuItem,getMenu,getOrders } from "../../types/Admin/adminAPI";



export const useAddMenuItem = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: addMenuItem,
      mutationKey: ["menuItem"],
      onSuccess: () => {
        toast.success("Menu item added successfully");
      },
      onError:()=>{
        toast.error("Failed to add menu item");
      }
    })
  
  }


  export const useGetMenuItems = (messCode) => {
    return useQuery({
      queryKey: ["menu", messCode],
      queryFn: () => getMenu(messCode).then((response) => response.data.data),
      enabled: !!messCode,
      onError: () => {
        toast.error("Failed to fetch menu items");
      },
    });
  }


    export const useGetOrders = (messCode) => {
    return useQuery({
      queryKey: ["orders", messCode],
      queryFn: () => getOrders(messCode).then((response) => response.data.data),
      enabled: !!messCode,
      onError: () => {
        toast.error("Failed to fetch orders");
      },
    });
  }