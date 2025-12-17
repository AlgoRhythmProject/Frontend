import type { Course } from "@/types/Course";
import apiClient from "./apiClient";

export const courseApi = {
    getAll: async (): Promise<Course[]> => {
        const res = await apiClient.get<Course[]>("/Course");
        return res.data;
    },

    getById: async (id: string): Promise<Course> => {
        const res = await apiClient.get<Course>(`/Course/${id}`);
        return res.data;
    }
};
