import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMenuItem,getMenu,getOrders, postNotice,getNotices, deleteNotice} from "../../types/Admin/adminAPI";



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
        toast.error("Failed to fetch menu items");
      },
    });
  }

  export const usePostNotice = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: postNotice,
      mutationKey: ["notice"],
    });

    onSuccess: () => {
      toast.success("Notice posted successfully");
    }

    onError: () => {
      toast.error("Failed to post notice");
    }
  }

  export const useGetNotices = (messCode) => {
    return useQuery({
      queryKey: ["notices", messCode],
      queryFn:()=> getNotices(messCode).then((response)=> response.data.data)

    })

  }

  export const deleteMotoceItem = ()=>{
 
        const queryClient = useQueryClient();
      
        return useMutation({
          mutationFn:deleteNotice,
          mutationKey:["notices"],

          onSuccess : ()=>{
            toast.success("Notice is deleted successfully")
          },

          onError:()=>{
            toast.error("please try again");
          }
        })
  
  }