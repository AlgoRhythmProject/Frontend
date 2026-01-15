import apiClient from "./apiClient";

export interface UserWithRoles {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailConfirmed: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

export const adminApi = {

    getAllUsers: async (): Promise<UserWithRoles[]> => {
        const response = await apiClient.get<UserWithRoles[]>('/Admin/users');
        return response.data;
    },


    getUserWithRoles: async (userId: string): Promise<UserWithRoles> => {
        const response = await apiClient.get<UserWithRoles>(`/Admin/users/${userId}`);
        return response.data;
    },

    assignAdminRole: async (userId: string): Promise<{ message: string; userId: string }> => {
        const response = await apiClient.post<{ message: string; userId: string }>(
            `/Admin/users/${userId}/assign-admin`
        );
        return response.data;
    },

    revokeAdminRole: async (userId: string): Promise<{ message: string; userId: string }> => {
        const response = await apiClient.post<{ message: string; userId: string }>(
            `/Admin/users/${userId}/revoke-admin`
        );
        return response.data;
    },

    isCurrentUserAdmin: async (): Promise<{ userId: string; isAdmin: boolean }> => {
        const response = await apiClient.get<{ userId: string; isAdmin: boolean }>('/Admin/is-admin');
        return response.data;
    },

};