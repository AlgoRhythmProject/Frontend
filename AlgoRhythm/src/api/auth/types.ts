import type { User } from "@/types/User";

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
    refreshToken: string;
    refreshTokenExpiresUtc: string;
    user: User;
}

export interface RefreshTokenResponse {
    accessToken: string;
    accessTokenExpiresUtc: string;
    refreshToken: string;
    refreshTokenExpiresUtc: string;
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

export interface GoogleAuthRequest {
    idToken: string;
    firstName?: string;
    lastName?: string;
}

export interface GoogleAuthResponse {
    token: string;
    expiresUtc: string;
    refreshToken: string;
    refreshTokenExpiresUtc: string;
    user: User;
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
