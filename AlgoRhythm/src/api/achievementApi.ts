import apiClient from "./apiClient";

export interface AchievementDto {
    id: string;
    name: string;
    description?: string;
    iconPath?: string;
}

export interface UserAchievementDto {
    id: string;
    achievementId: string;
    achievementName: string;
    achievementDescription?: string;
    iconPath?: string;
    isCompleted: boolean;
    earnedAt?: string;
    progress?: number;
    totalRequired?: number;
}

export interface EarnedAchievementDto {
    id: string;
    achievementId: string;
    name: string;
    description?: string;
    earnedAt: string;
}

export const achievementApi = {
    getAll: async (): Promise<AchievementDto[]> => {
        const res = await apiClient.get<AchievementDto[]>("/Achievement");
        return res.data;
    },

    getById: async (id: string): Promise<AchievementDto> => {
        const res = await apiClient.get<AchievementDto>(`/Achievement/${id}`);
        return res.data;
    },

    getMyAchievements: async (): Promise<UserAchievementDto[]> => {
        const res = await apiClient.get<UserAchievementDto[]>("/Achievement/my-achievements");
        return res.data;
    },

    getMyAchievement: async (achievementId: string): Promise<UserAchievementDto> => {
        const res = await apiClient.get<UserAchievementDto>(`/Achievement/my-achievements/${achievementId}`);
        return res.data;
    },

    getMyEarned: async (): Promise<EarnedAchievementDto[]> => {
        const res = await apiClient.get<EarnedAchievementDto[]>("/Achievement/my-earned");
        return res.data;
    },

    refresh: async (): Promise<{ message: string }> => {
        const res = await apiClient.post<{ message: string }>("/Achievement/refresh");
        return res.data;
    },
};