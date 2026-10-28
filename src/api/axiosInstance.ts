import axios from "axios";
import { attachAuthInterceptor } from "../interceptors/authInterceptor";

const api = axios.create({
  baseURL: "https://localhost:7160/api",
  headers: { "Content-Type": "application/json" },
});

attachAuthInterceptor(api);

export default api;
