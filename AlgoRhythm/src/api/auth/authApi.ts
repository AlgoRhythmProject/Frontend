import apiClient from "../apiClient";
import type { User } from "../../types/User";
import { type LoginRequest, type LoginResponse, type RegisterRequest, type RegisterResponse, type ResetPasswordRequest, type ChangePasswordRequest, type UpdateProfileRequest, type RefreshTokenResponse, type GoogleAuthResponse, type ErrorResponse, ApiError } from "./types";

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
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new ApiError(
                errorData?.code || 'UNKNOWN_ERROR',
                errorData?.message || 'Logout failed. Please try again.',
                error.response?.status
            );
        }
    },

    refreshToken: async (): Promise<string> => {
        try {
            const response = await apiClient.post<RefreshTokenResponse>("/Authentication/refresh-token");
            return response.data.accessToken;
        } catch (error: any) {
            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'INVALID_REFRESH_TOKEN',
                errorData?.message || 'Session expired. Please login again.',
                error.response?.status
            );
        }
    },

    googleLogin: async (idToken: string, firstName?: string, lastName?: string): Promise<User> => {
        try {
            console.log("=== Sending Google Login Request ===");
            console.log("Token length:", idToken.length);
            console.log("Request body:", { idToken: idToken.substring(0, 50) + "...", firstName, lastName });

            const response = await apiClient.post<GoogleAuthResponse>("/Authentication/google", {
                idToken,
                firstName,
                lastName
            });

            console.log("=== Google Login Response ===");
            console.log("Response status:", response.status);
            console.log("Response data:", response.data);

            const { token, user } = response.data;
            return { ...user, token };
        } catch (error: any) {
            console.error("=== Google Login API Error ===");
            console.error("Error response:", error.response);
            console.error("Error data:", error.response?.data);
            console.error("Error status:", error.response?.status);

            const errorData = error.response?.data as ErrorResponse;
            throw new ApiError(
                errorData?.code || 'GOOGLE_LOGIN_FAILED',
                errorData?.message || 'Google login failed. Please try again.',
                error.response?.status
            );
        }
    },
};