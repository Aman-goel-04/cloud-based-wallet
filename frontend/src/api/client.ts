import axios from "axios";

export const instance = axios.create({
	baseURL: "http://localhost:3000/api/v1",
	timeout: 5000,
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});