export interface UserStreakDto {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastLoginDate: string | null;
}
