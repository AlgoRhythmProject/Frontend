import type { Lecture } from "@/types/Lecture";
import apiClient from "./apiClient";

export const lectureApi = {
    getAll: async (): Promise<Lecture[]> => {
        const res = await apiClient.get<Lecture[]>("/Lecture");
        return res.data;
    },

    getById: async (id: string): Promise<Lecture> => {
        const res = await apiClient.get<Lecture>(`/Lecture/${id}`);
        return res.data;
    }
};
