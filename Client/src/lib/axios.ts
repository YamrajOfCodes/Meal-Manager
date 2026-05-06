import axios from "axios";

export const api = axios.create({
  baseURL: "https://meal-manager-q6de.onrender.com/api",
});