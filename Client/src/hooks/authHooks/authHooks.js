import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, register } from "../../types/Auth/authAPI"

import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';
import { AxiosError } from 'axios';


export const useLogin = () => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      // console.log(data);
      const token = data.access_token;
      localStorage.setItem('login', token);

      const decoded = jwtDecode(token);

      // 🔥 match your backend roles
      if (decoded.role === 'owner') {
        window.location.href="/admin"
      } else if (decoded.role === 'student') {
        window.location.href="/student"
      } else if (decoded.role === 'superadmin') {
        // navigate('/super-admin');
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Login successful');
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong';

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