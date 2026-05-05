import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData, login, logout, register } from "../../types/Auth/authAPI"

import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';
import { AxiosError } from 'axios';
import {useNavigate} from "react-router-dom"



export const useLogin = () => {
  const navigate = useNavigate();
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const token = data.access_token;
      localStorage.setItem('login', token);

      const decoded = jwtDecode(token);

      if (decoded.role === 'owner') {
        navigate('/admin');
      } else if (decoded.role === 'customer') {
        navigate("/customer");
      } else if (decoded.role === 'superadmin') {
        navigate('/super-admin');
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Login successful');
    },

    onError: (error) => {

      console.log(error)
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong';

        console.log(message)

      if (error?.response?.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error(message);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      toast.success(data?.message || 'Registration successful');
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Registration failed';

      toast.error(message);
    },
  });
};

export const useLogout = () => {
  // const navigate = useNavigate(); // ✅ correct
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      localStorage.removeItem('login');
      queryClient.invalidateQueries({ queryKey: ['me'] });

      toast.success('Logged out successfully');

      setTimeout(() => {
        window.location.href='/'; // ✅ correct
      }, 500);
    },

    onError: () => {
      toast.error('Error logging out. Please try again.');
    },
  });
};


export const useGetUserData = (userId) => {
  const queryClient = useQueryClient();
   queryClient.invalidateQueries({ queryKey: ['users'] });

  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUserData(userId).then((res) => {
        return res;
      }),
    enabled: !!userId,
  });
};