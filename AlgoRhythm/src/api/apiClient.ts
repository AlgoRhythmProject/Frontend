import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { config } from "@/config/global";

const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
        accept: "*/*",
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/Authentication/login') ||
                originalRequest.url?.includes('/Authentication/register') ||
                originalRequest.url?.includes('/Authentication/verify-email') ||
                originalRequest.url?.includes('/Authentication/refresh-token')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/Authentication/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                localStorage.setItem("token", newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                processQueue(null, newAccessToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
