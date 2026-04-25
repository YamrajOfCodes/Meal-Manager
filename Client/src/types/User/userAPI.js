import { api } from "../../lib/axios";


export const getMenu = (messCode) => {
  const token = localStorage.getItem("login");
  return api.get(`/user/getMenu/${messCode}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 



export const placeAnOrder = (orderData) => {
    console.log("orerData in API:", orderData);
  const token = localStorage.getItem("login");
  return api.post("/user/placeOrder", orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 

export const getMyOrders = (userId) => {
    const token = localStorage.getItem("login");
    return api.get(`/user/getMyOrders/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}



export const RaiseComplaint = (complaint) => {
  const token = localStorage.getItem("login");
  return api.post("/user/postcomplaint", complaint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}; 


export const getComplaints = (messCode) => {
    const token = localStorage.getItem("login");
    return api.get(`/user/getallcomplaints/${messCode}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

}
