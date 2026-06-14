import axios from "axios";

export const instance = axios.create({
	baseURL: "http://localhost:3000/api/v1",
	timeout: 5000,
	withCredentials: true,
});
