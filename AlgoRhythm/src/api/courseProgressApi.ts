import type { CourseProgress } from "@/types/CourseProgress";
import apiClient from "./apiClient";

export interface LectureCompletionResponse {
    message: string;
    isCompleted?: boolean;
    lectureId: string;
}

export interface LectureCompletionDto {
    lectureId: string;
    isCompleted: boolean;
}

export const courseProgressApi = {
    getAllMyProgress: async (): Promise<CourseProgress[]> => {
        const res = await apiClient.get<CourseProgress[]>('/CourseProgress/my-progress');
        return res.data;
    },

    getMyCourseProgress: async (courseId: string): Promise<CourseProgress> => {
        const res = await apiClient.get<CourseProgress>(
            `/CourseProgress/my-progress/${courseId}`
        );
        return res.data;
    },

    toggleLectureCompletion: async (lectureId: string): Promise<LectureCompletionResponse> => {
        const res = await apiClient.post<LectureCompletionResponse>(
            `/CourseProgress/lecture/${lectureId}/toggle`
        );
        return res.data;
    },

    markLectureAsCompleted: async (lectureId: string): Promise<LectureCompletionResponse> => {
        const res = await apiClient.post<LectureCompletionResponse>(
            `/CourseProgress/lecture/${lectureId}/complete`
        );
        return res.data;
    },

    markLectureAsIncomplete: async (lectureId: string): Promise<LectureCompletionResponse> => {
        const res = await apiClient.post<LectureCompletionResponse>(
            `/CourseProgress/lecture/${lectureId}/uncomplete`
        );
        return res.data;
    },

    recalculateProgress: async (courseId: string): Promise<{ message: string }> => {
        const res = await apiClient.post<{ message: string }>(
            `/CourseProgress/recalculate/${courseId}`
        );
        return res.data;
    },

    isLectureCompleted: async (lectureId: string): Promise<LectureCompletionDto> => {
        const res = await apiClient.get<LectureCompletionDto>(
            `/CourseProgress/lecture/${lectureId}/is-completed`
        );
        return res.data;
    },

    getCompletedLectureIds: async (courseId: string): Promise<string[]> => {
        const res = await apiClient.get<string[]>(
            `/CourseProgress/course/${courseId}/completed-lectures`
        );
        return res.data;
    },

    getCompletedTaskIds: async (courseId: string): Promise<string[]> => {
        const res = await apiClient.get<string[]>(
            `/CourseProgress/course/${courseId}/completed-tasks`
        );
        return res.data;
    },
};