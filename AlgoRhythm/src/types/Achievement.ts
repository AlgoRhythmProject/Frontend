export interface Achievement {
    id: string;
    achievementId: string;
    achievementName: string;
    achievementDescription?: string;
    iconPath?: string;
    earnedAt: string;
    isCompleted: boolean;
}