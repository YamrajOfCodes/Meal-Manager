import { api } from "../../lib/axios";

export const getAllOwners = async (data) => {
  const res = await api.get('/superAdmin/getAllOwners', data);
  return res.data;
};

export const updateMessStatus = async (data) => {
  const res = await api.patch('/superAdmin/updateMessStatus', data);
  return res.data;
}

export const updateMessOwner = async (data) => {
  const res = await api.patch('/superAdmin/updateMessOwner', data);
  return res.data;
}

export const deleteMessOwner = async (ownerId) => {
  const res = await api.delete(`/superAdmin/deleteMessOwner/${ownerId}`);
  return res.data;
}