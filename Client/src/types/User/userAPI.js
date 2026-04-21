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