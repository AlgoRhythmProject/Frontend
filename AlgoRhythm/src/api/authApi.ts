// src/api/authApi.ts
import apiClient from "./apiClient";
import type { User } from "../types/User";

export interface LoginRequest {
    email: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<User> => {
        const response = await apiClient.post("/Authentication/login", credentials);
        return response.data;
    },
};
