import type { Course } from "@/types/Course";
import apiClient from "./apiClient";
export interface CourseListItem {
    id: string;
    name: string;
}
export const courseApi = {
    getAll: async (): Promise<Course[]> => {
        const res = await apiClient.get<Course[]>("/Course");
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
    }
};
