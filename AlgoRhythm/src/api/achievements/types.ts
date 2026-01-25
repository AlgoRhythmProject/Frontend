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