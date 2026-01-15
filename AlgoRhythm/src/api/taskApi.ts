import type { Task, TaskInputDto, TaskDetailsDto } from "@/types/Task";
import apiClient from "./apiClient";

export const taskApi = {
    getAll: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task");
        return res.data;
    },
    getById: async (id: string): Promise<TaskDetailsDto> => {
        const res = await apiClient.get<TaskDetailsDto>(`/Task/${id}`);
        return res.data;
    },
    getAllWithCourses: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task/with-courses");
        return res.data;
    },
    getPublished: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task/published");
        return res.data;
    },
    create: async (dto: TaskInputDto): Promise<Task> => {
        const res = await apiClient.post<Task>("/Task", dto);
        return res.data;
    },
    update: async (id: string, dto: TaskInputDto): Promise<void> => {
        await apiClient.put(`/Task/${id}`, dto);
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Task/${id}`);
    },
    addTag: async (taskId: string, tagId: string): Promise<void> => {
        await apiClient.post(`/Task/${taskId}/tags/${tagId}`);
    },
    removeTag: async (taskId: string, tagId: string): Promise<void> => {
        await apiClient.delete(`/Task/${taskId}/tags/${tagId}`);
    },
    addHint: async (taskId: string, hintId: string): Promise<void> => {
        await apiClient.post(`/Task/${taskId}/hints/${hintId}`);
    },
    removeHint: async (taskId: string, hintId: string): Promise<void> => {
        await apiClient.delete(`/Task/${taskId}/hints/${hintId}`);
    }
};