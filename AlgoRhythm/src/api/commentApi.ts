import apiClient from "./apiClient";
import type { Comment, CommentInputDto } from "@/types/Comment";

export const commentApi = {
    getByTaskId: async (taskId: string): Promise<Comment[]> => {
        const res = await apiClient.get<Comment[]>(`/Comment/task/${taskId}`);
        return res.data;
    },

    getById: async (id: string): Promise<Comment> => {
        const res = await apiClient.get<Comment>(`/Comment/${id}`);
        return res.data;
    },

    create: async (dto: CommentInputDto): Promise<Comment> => {
        console.log("🔵 commentApi.create called with:", dto);
        const res = await apiClient.post<Comment>("/Comment", dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("🟢 commentApi.create response:", res.data);
        return res.data;
    },

    update: async (id: string, content: string): Promise<void> => {
        await apiClient.put(`/Comment/${id}`, JSON.stringify(content), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Comment/${id}`);
    }
};