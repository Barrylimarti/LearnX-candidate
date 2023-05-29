import api from "./api";

const useApi = (requiresAuth = false) => {
  function request(method) {
    return (
      url,
      data,
      contentType = "application/json",
      responseType = "json"
    ) =>
      api
        .request({
          method,
          url,
          data,
          responseType,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
          },
          requiresAuth,
        })
        .then(({ data }) => data)
        .catch((error) => {
          console.error(error);
          if (error.response?.status) {
            if (error.response.status >= 500)
              return Promise.reject({ err: error, verb: "Server error!" });
            else if (error.response.status < 500)
              return Promise.reject({
                err: error,
                verb: error.response.data.error,
              });
          }
          return Promise.reject({ err: error, verb: "Unknown error!" });
        });
  }

  return {
    get: request("get"),
    post: request("post"),
    delete: request("delete"),
    patch: request("patch"),
  };
};

export default useApi;
