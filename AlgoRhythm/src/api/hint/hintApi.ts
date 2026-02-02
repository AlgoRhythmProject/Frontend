import type { Hint } from "@/types/Hint";
import apiClient from "../apiClient";
import type { HintInputDto } from "./types";

export const hintApi = {
    getByTaskId: async (taskId: string): Promise<Hint[]> => {
        const res = await apiClient.get<Hint[]>(`/Hint/task/${taskId}`);
        return res.data;
    },
    getById: async (id: string): Promise<Hint> => {
        const res = await apiClient.get<Hint>(`/Hint/${id}`);
        return res.data;
    },
    create: async (dto: HintInputDto): Promise<Hint> => {
        const res = await apiClient.post<Hint>("/Hint", dto);
        return res.data;
    },
    update: async (id: string, dto: HintInputDto): Promise<void> => {
        await apiClient.put(`/Hint/${id}`, dto);
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Hint/${id}`);
    }
};