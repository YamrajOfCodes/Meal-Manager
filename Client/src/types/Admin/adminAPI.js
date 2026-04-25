import { api } from "../../lib/axios";

export const addMenuItem = (data) => {
  const token = localStorage.getItem("login");
  return api.post("/admin/addMenu", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getMenu = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/admin/getMenu/${messCode}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 


export const getOrders = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/admin/getOrders/${messCode}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 


export const postNotice = (data) => {
  const token = localStorage.getItem("login");
  return api.post("/admin/postNotice", data, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const getNotices = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/admin/getNotices/${messCode}`, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const deleteNotice = (id) => {
  const token = localStorage.getItem("login");
  return api.delete(`/admin/deleteNotice/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}