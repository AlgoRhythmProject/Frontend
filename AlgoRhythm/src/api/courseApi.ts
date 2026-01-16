import type { Course } from "@/types/Course";
import apiClient from "./apiClient";

export interface CourseListItem {
    id: string;
    name: string;
}

export interface CourseInputDto {
    name: string;
    description?: string;
    isPublished: boolean;
}

export const courseApi = {
    getAll: async (): Promise<Course[]> => {
        const res = await apiClient.get<Course[]>("/Course");
        return res.data;
    },

    getPublished: async (): Promise<Course[]> => {
        const res = await apiClient.get<Course[]>("/Course/published");
        return res.data;
    },

    getListItems: async (): Promise<CourseListItem[]> => {
        const res = await apiClient.get<Course[]>("/Course");
        return res.data.map(course => ({
            id: course.id,
            name: course.name
        }));
    },

    getById: async (id: string): Promise<Course> => {
        const res = await apiClient.get<Course>(`/Course/${id}`);
        return res.data;
    },

    create: async (dto: CourseInputDto): Promise<Course> => {
        const res = await apiClient.post<Course>("/Course", dto);
        return res.data;
    },

    update: async (id: string, dto: CourseInputDto): Promise<void> => {
        await apiClient.put(`/Course/${id}`, dto);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Course/${id}`);
    },

    addTask: async (courseId: string, taskId: string): Promise<void> => {
        await apiClient.post(`/Course/${courseId}/tasks/${taskId}`);
    },

    removeTask: async (courseId: string, taskId: string): Promise<void> => {
        await apiClient.delete(`/Course/${courseId}/tasks/${taskId}`);
    },

    addLecture: async (courseId: string, lectureId: string): Promise<void> => {
        await apiClient.post(`/Course/${courseId}/lectures/${lectureId}`);
    },

    removeLecture: async (courseId: string, lectureId: string): Promise<void> => {
        await apiClient.delete(`/Course/${courseId}/lectures/${lectureId}`);
    }
};