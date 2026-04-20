import { api } from "../../lib/axios";

export const getAllOwners = async (data) => {
  const localToken = localStorage.getItem("login");
  if (!localToken) {
    throw new Error("Authentication token not found");
  }
  const res = await api.get('/superAdmin/getAllOwners',{
    headers: {
      Authorization: `Bearer ${localToken}`
    }
  });
  return res.data;
};

export const updateMessStatus = async (data) => {
  const res = await api.patch('/superAdmin/updateMessStatus', data,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("login")}`
    }
  });
  return res.data;
}

export const updateMessOwner = async (data) => {
  const res = await api.patch('/superAdmin/updateMessOwner', data,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("login")}`
    }
  });
  return res.data;
}

export const deleteMessOwner = async (ownerId) => {
  const res = await api.delete(`/superAdmin/deleteMessOwner/${ownerId}`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("login")}`
    }
  });
  return res.data;
}