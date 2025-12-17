import type { Task } from "@/types/Task";
import apiClient from "./apiClient";

export interface TaskListResponse {
    tasks: Task[];
    totalCount: number;
}

export const taskApi = {
    getAll: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task");
        return res.data;
    },

    getById: async (id: string): Promise<Task> => {
        const res = await apiClient.get<Task>(`/Task/${id}`);
        return res.data;
    },
    getAllWithCourses: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task/with-courses");
        return res.data;
    },
};