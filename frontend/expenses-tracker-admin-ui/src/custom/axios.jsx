import axios from "axios";

const customAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

// intercept error status 401, get new token from server if user is logged in, retry original request
customAxios.interceptors.response.use(
    res => res, 
    error => {
        let originalRequest = error.config;

        // handle 401 error
        // prevent retry loop using '_retry' property
        if(error.response?.status === 401 && !originalRequest._retry ){
            originalRequest._retry = true;

            let tokens = {
                token: localStorage.getItem("token"),
                refreshToken: localStorage.getItem("refreshToken")
            }

            // get new token from server
            return axios.post(import.meta.env.VITE_API_BASE_URL + '/api/v1/Account/Refresh', tokens)
                .then(refreshResponse => {
                    localStorage.setItem("token", refreshResponse.data.token);
                    localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);

                    // retry original request
                    originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.token}`;
                    return customAxios(originalRequest);
                })
                .catch(refreshError => {
                    return Promise.reject(refreshError);
                });
        }
        return Promise.reject(error);
    })

export default customAxios;