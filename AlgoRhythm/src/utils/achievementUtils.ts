import type { UserAchievementDto } from "@/api/achievements/types";


export function getNewlyEarnedAchievements(
    oldAchievements: UserAchievementDto[],
    newAchievements: UserAchievementDto[]
): UserAchievementDto[] {
    return newAchievements.filter(newAch => {
        if (!newAch.isCompleted) return false;

        const oldAch = oldAchievements.find(old => old.achievementId === newAch.achievementId);

        return !oldAch || !oldAch.isCompleted;
    });
}


export async function checkAndShowNewAchievements(
    oldAchievements: UserAchievementDto[],
    fetchAchievements: () => Promise<UserAchievementDto[]>,
    showAchievement: (achievement: {
        id: string;
        achievementId: string;
        achievementName: string;
        achievementDescription?: string;
        iconPath?: string;
        earnedAt: string;
        isCompleted: boolean;
    }) => void
): Promise<UserAchievementDto[]> {
    try {
        const newAchievements = await fetchAchievements();
        const newlyEarned = getNewlyEarnedAchievements(oldAchievements, newAchievements);

        newlyEarned.forEach(achievement => {
            showAchievement({
                id: achievement.id,
                achievementId: achievement.achievementId,
                achievementName: achievement.achievementName,
                achievementDescription: achievement.achievementDescription,
                iconPath: achievement.iconPath,
                earnedAt: achievement.earnedAt || new Date().toISOString(),
                isCompleted: achievement.isCompleted,
            });
        });

        return newAchievements;
    } catch (error) {
        console.error('Error checking achievements:', error);
        return oldAchievements;
    }
}