import { api } from "../../lib/axios";

export const getAllCustomers = async (data) => {
  const res = await api.get(`/admin/getAllCustomers?messCode=${data.messCode}`);
  return res.data;
};

