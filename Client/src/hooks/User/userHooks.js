import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMenu,placeAnOrder,getMyOrders,RaiseComplaint,getComplaints } from "../../types/User/userAPI";
import toast from "react-hot-toast";



  export const useGetMenuItems = (messCode) => {
      const queryClient = useQueryClient();

    return useQuery({
      queryKey: ["menu", messCode],
      queryFn: () => {
        // console.log("Calling getMenu with messCode:", messCode);
        return getMenu(messCode).then((response) => response.data.data);
      },
      enabled: !!messCode,
      onError: () => {
        toast.error("Failed to fetch menu items");
      },
    });
    
  }

// In userHooks.js — add onSuccess invalidation to usePlaceOrder
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => placeAnOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["myOrders", variables.userId]);
      queryClient.invalidateQueries(["menuItems"]);
    },
  });
};

export const useGetMyOrders = (userId)=>{
    return useQuery({
        queryKey: ["myOrders", userId],
        queryFn: () => getMyOrders(userId).then((response) => response.data.data),
        enabled: !!userId,
        onError: () => {
          toast.error("Failed to fetch your orders");
        },
    });
};


export const useRaiseComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => RaiseComplaint(data),
    mutationKey:["complaint"],
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["complaint"]);
      toast.success("Your Voice is Raised Successfully");
    },
  });
};


export const useGetComplaints = (messCode)=>{
    return useQuery({
        queryKey: ["complaint", messCode],
        queryFn: () => getComplaints(messCode).then((response) => response.data.data),
        enabled: !!messCode,
        onError: () => {
          toast.error("Failed to fetch your orders");
        },
    });
};

