import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMenu,placeAnOrder } from "../../types/User/userAPI";
import toast from "react-hot-toast";



  export const useGetMenuItems = (messCode) => {
      const queryClient = useQueryClient();

    return useQuery({
      queryKey: ["menu", messCode],
      queryFn: () => {
        console.log("Calling getMenu with messCode:", messCode);
        return getMenu(messCode).then((response) => response.data.data);
      },
      enabled: !!messCode,
      onError: () => {
        toast.error("Failed to fetch menu items");
      },
    });
    
  }

  export const usePlaceOrder = ()=>{
    const queryClient = useQueryClient();
    return useMutation({ 
    mutationFn: placeAnOrder,
    mutationKey: ["placeOrder"],
    onSuccess:()=>{
        toast.success("Order placed successfully");
    },
    onError:()=>{
        toast.error("Failed to place order");
    }

     }
)  }

