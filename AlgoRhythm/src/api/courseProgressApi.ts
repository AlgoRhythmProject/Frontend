import apiClient from "./apiClient";

export interface CourseProgress {
    id: string;
    userId: string;
    courseId: string;
    courseName: string;
    percentage: number; // 0..100
    startedAt?: string | null;
    completedAt?: string | null;
}

export const courseProgressApi = {
    getMyProgress: async (courseId: string): Promise<CourseProgress> => {
        const res = await apiClient.get<CourseProgress>(`/CourseProgress/my-progress/${courseId}`);
        return res.data;
    },
};
