import apiClient from "./apiClient";

export interface UserStreakDto {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastLoginDate: string | null;
}

export const userStreakApi = {
    getMyStreak: async (): Promise<UserStreakDto> => {
        const res = await apiClient.get<UserStreakDto>("/UserStreak/my-streak");
        return res.data;
    },

    getUserStreak: async (userId: string): Promise<UserStreakDto> => {
        const res = await apiClient.get<UserStreakDto>(`/UserStreak/${userId}`);
        return res.data;
    },

    updateStreak: async (userId: string): Promise<void> => {
        await apiClient.post(`/UserStreak/${userId}/update`);
    },
};