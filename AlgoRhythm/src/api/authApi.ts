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

export interface ErrorResponse {
    code: string;
    message: string;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface ResendVerificationCodeRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export class ApiError extends Error {
    code: string;
    status?: number;

    constructor(code: string, message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
    }
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<User> => {
        try {
            const response = await apiClient.post<LoginResponse>("/Authentication/login", credentials);
            const { token, user } = response.data;
            return { ...user, token };
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Login failed. Please try again.',
                error.response?.status
            );
        }
    },

    register: async (data: RegisterRequest): Promise<void> => {
        try {
            await apiClient.post<RegisterResponse>("/Authentication/register", data);
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Registration failed. Please try again.',
                error.response?.status
            );
        }
    },

    verifyEmail: async (email: string, code: string): Promise<User> => {
        try {
            const response = await apiClient.post<LoginResponse>("/Authentication/verify-email", {
                email,
                code
            });
            const { token, user } = response.data;
            return { ...user, token };
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Email verification failed. Please try again.',
                error.response?.status
            );
        }
    },

    resendVerificationCode: async (email: string): Promise<void> => {
        try {
            await apiClient.post("/Authentication/resend-verification-code", { email });
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Failed to resend verification code. Please try again.',
                error.response?.status
            );
        }
    },

    forgotPassword: async (email: string): Promise<void> => {
        try {
            await apiClient.post("/Authentication/forgot-password", { email });
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Failed to send reset code. Please try again.',
                error.response?.status
            );
        }
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        try {
            await apiClient.post("/Authentication/reset-password", data);
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Failed to reset password. Please try again.',
                error.response?.status
            );
        }
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        try {
            await apiClient.post("/Authentication/change-password", data);
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Failed to change password. Please try again.',
                error.response?.status
            );
        }
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        try {
            const response = await apiClient.put<User>("/Authentication/update-profile", data);
            return response.data;
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Failed to update profile. Please try again.',
                error.response?.status
            );
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post("/Authentication/logout");
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Logout failed. Please try again.',
                error.response?.status
            );
        }
    }
};