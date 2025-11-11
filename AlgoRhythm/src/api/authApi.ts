import apiClient from "./apiClient";
import type { User } from "../types/User";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginResponse {
    token: string;
    expiresUtc: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<User> => {
        const response = await apiClient.post<LoginResponse>("/Authentication/login", credentials);
        const { token, user } = response.data;
        return { ...user, token };
    },
    register: async (data: RegisterRequest): Promise<boolean> => {
        try {
            const response = await apiClient.post("/Authentication/register", data);
            return response.status >= 200 && response.status < 300;
        } catch (error: any) {
            return false;
        }
    },
    verifyEmail: async (email: string, code: string): Promise<User> => {
        const response = await apiClient.post("/Authentication/verify-email", { email, code });
        const { token, user } = response.data;
        return { ...user, token };
    },
    logout: async (): Promise<boolean> => {
        try {
            const response = await apiClient.post("/Authentication/logout");
            return response.status >= 200 && response.status < 300;
        } catch (error: any) {
            return false;
        }
    }
};
