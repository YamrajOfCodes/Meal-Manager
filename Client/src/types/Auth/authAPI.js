import { api } from '../../lib/axios';

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const register = async (data) => {
  const res = await api.post('/auth/insertUser', data);
  return res.data;
};

export const logout = async () => {
  const token = localStorage.getItem('login');
  await api.post(
    '/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getUserData = async (userId) => {
  const token = localStorage.getItem('login');
  const res = await api.get(`/auth/getUserData/${userId}`);
  return res.data.data;
};
