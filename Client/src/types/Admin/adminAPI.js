import { api } from "../../lib/axios";

export const addMenuItem = (data) => api.post("/admin/addMenu",data);
export const getMenu = (messCode) => api.get(`/admin/getMenu/${messCode}`); 