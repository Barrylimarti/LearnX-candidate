import axios from "axios";

import getClientOS from "./clientInfo";

const api = axios.create({
	baseURL: "/api",
});

api.interceptors.request.use(
	(config) => {
		if (config.requiresAuth) {
			const token = localStorage.getItem("accessToken");
			if (token) config.headers["Authorization"] = `Bearer ${token}`;
		}
		config.headers["client-device"] = JSON.stringify(getClientOS(window));
		// console.log(config);
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	async (response) => {
		return Promise.resolve(response);
	},
	async (error) => {
		return Promise.reject(error);
	}
);

export default api;
