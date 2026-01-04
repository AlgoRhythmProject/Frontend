import apiClient from "./apiClient";
import type { Comment, CommentInputDto } from "@/types/Comment";

export const commentApi = {
    // Pobierz wszystkie komentarze dla zadania
    // Backend endpoint to /Comment/task/{taskId} ale w response jest taskItemId
    getByTaskId: async (taskId: string): Promise<Comment[]> => {
        const res = await apiClient.get<Comment[]>(`/Comment/task/${taskId}`);
        return res.data;
    },

    // Pobierz pojedynczy komentarz
    getById: async (id: string): Promise<Comment> => {
        const res = await apiClient.get<Comment>(`/Comment/${id}`);
        return res.data;
    },

    // Utwórz nowy komentarz
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

    // Edytuj komentarz (tylko content)
    update: async (id: string, content: string): Promise<void> => {
        await apiClient.put(`/Comment/${id}`, JSON.stringify(content), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    // Usuń komentarz
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Comment/${id}`);
    }
};