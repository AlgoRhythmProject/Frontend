import apiClient from "../apiClient";
import type { AchievementDto, EarnedAchievementDto, UserAchievementDto } from "./types";

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