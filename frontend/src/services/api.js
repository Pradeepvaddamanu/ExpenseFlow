import axios from "axios";

const api = axios.create({
  baseURL: "https://expenseflow-api-9w4g.onrender.com",
});

export default api;