import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  addMenuItem, 
  getMenu, 
  getOrders, 
  postNotice, 
  getNotices, 
  deleteNotice, 
  getUsers, 
  updateUserPayment, 
  updateComplaint, 
  createLabel,
  getLabels,
  deleteLabel,
  AssignLabel,
  UnAssignLabel
} from "../../types/Admin/adminAPI";



export const useAddMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMenuItem,
    mutationKey: ["menuItem"],
    onSuccess: () => {
      toast.success("Menu item added successfully");
    },
    onError: () => {
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

    onSuccess: (_, variables) => {
      toast.success("Notice posted successfully");

      queryClient.invalidateQueries({
        queryKey: ["notices", variables.messCode]
      });
    },

    onError: () => {
      toast.error("Failed to post notice");
    }
  });

}

export const useGetNotices = (messCode) => {
  return useQuery({
    queryKey: ["notices", messCode],
    queryFn: () => getNotices(messCode).then((response) => response.data.data)

  })

}

export const deleteMotoceItem = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotice,
    mutationKey: ["notices"],

    onSuccess: () => {
      toast.success("Notice is deleted successfully")
    },

    onError: () => {
      toast.error("please try again");
    }
  })

}


export const useGetUsers = (messCode) => {
  return useQuery({
    queryKey: ["users", messCode],
    queryFn: () => getUsers(messCode).then((response) => response.data.data)

  })

}



export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserPayment,

    onSuccess: (_, variables) => {
      toast.success("Payment Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: () => {
      toast.error("Failed to Update Payment");
    }
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComplaint,

    onSuccess: () => {
    toast.success("Complaint Updated successfully");
     queryClient.invalidateQueries({ queryKey: ["complaint"] });
  },

  onError: () => {
    toast.error("Failed to Update Payment");
  }
  });

 
}


export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLabel,

    onSuccess: (_, variables) => {
      toast.success("label successfully");
      queryClient.invalidateQueries({ queryKey: ["label"] });
    },

    onError: () => {
      toast.error("Failed to create label");
    }
  });
};



export const useGetLabels = (userId) => {
  return useQuery({
    queryKey: ["label",userId],
    queryFn: () => getLabels(userId).then(res => res.data), 
  });
};

export const useDeleteLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLabel,

    onSuccess: (_, deletedId) => {
      toast.success("label deleted successfully");

      queryClient.setQueryData(["label"], (oldData) => {
        return oldData?.filter(label => label._id !== deletedId);
      });
    },

    onError: () => {
      toast.error("Failed to delete label");
    }
  });
};



export const useAssignLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AssignLabel,

    onSuccess: (_,) => {
      toast.success("label assigned successfully");

      queryClient.setQueryData(["label"]);
    },

    onError: () => {
      toast.error("Failed to assign label");
    }
  });
};


export const useunAssignLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UnAssignLabel,

    onSuccess: (_,) => {
      toast.success("label unassigned successfully");

      queryClient.setQueryData(["label"]);
    },

    onError: () => {
      toast.error("Failed to unassigned label");
    }
  });
};





