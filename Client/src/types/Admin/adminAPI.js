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


export const getUsers = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/admin/getallusers/${messCode}`, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const updateUserPayment = (data) => {
  const token = localStorage.getItem("login");
  return api.put(`/admin/updateUserPayment`,data,{  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const updateComplaint = (data) => {
  const token = localStorage.getItem("login");
  return api.patch(`/admin/updateComplaint`,data,{  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const createLabel = (data) => {
  const token = localStorage.getItem("login");
  return api.post(`/admin/createLabel/${data.userId}`,data,{  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const getLabels = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/admin/getlabel`, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



export const deleteLabel = (labelId) => {
  const token = localStorage.getItem("login");
  return api.delete(`/admin/deleteLabel/${labelId}`, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const AssignLabel = (data) => {
  const token = localStorage.getItem("login");
  return api.put(`/admin/assignlabel`, data,{  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const UnAssignLabel = (userId) => {
  const token = localStorage.getItem("login");
  console.log(token);
  return api.put(`/admin/unassignlabel/${userId}`,{},{  
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



