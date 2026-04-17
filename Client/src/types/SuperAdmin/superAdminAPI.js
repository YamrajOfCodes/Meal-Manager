import { api } from "../../lib/axios";

export const getAllOwners = async (data) => {
  const res = await api.get('/superAdmin/getAllOwners', data);
  return res.data;
};

export const updateMessStatus = async (data) => {
  const res = await api.patch('/superAdmin/updateMessStatus', data);
  return res.data;
}