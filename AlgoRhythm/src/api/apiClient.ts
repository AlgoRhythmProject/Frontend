import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7080/api",
    headers: {
        "Content-Type": "application/json",
        accept: "*/*",
    },
    withCredentials: true,
});


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
