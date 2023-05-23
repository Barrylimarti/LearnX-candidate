import axios from 'axios';

const useFetchWrapper = () => {
	function request(method, contentType = "application/json") {
		return (url, body, requiresAuth = true) => {
			return axios({
				method,
				url,
				headers: requiresAuth
					? { ...authHeader(url), "Content-Type": contentType }
					: { "Content-Type": contentType },
				data: body,
			}).then(({ data }) => {
				return data;
			});
		};
	}

	return {
		get: request("GET"),
		post: request("POST"),
		postForm: request("POST", "multipart/form-data"),
		put: request("PUT"),
		delete: request("DELETE"),
	};
};

export { useFetchWrapper };
