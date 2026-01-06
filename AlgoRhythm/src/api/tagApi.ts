import apiClient from "./apiClient";

export interface Tag {
    id: string;
    name: string;
    description: string;
}

export const tagApi = {
    getAll: async (): Promise<Tag[]> => {
        const res = await apiClient.get<Tag[]>("/Tag");
        return res.data;
    },
    getById: async (id: string): Promise<Tag> => {
        const res = await apiClient.get<Tag>(`/Tag/${id}`);
        return res.data;
    },
    create: async (name: string): Promise<Tag> => {
        const res = await apiClient.post<Tag>("/Tag", { name });
        return res.data;
    },
    update: async (id: string, name: string): Promise<void> => {
        await apiClient.put(`/Tag/${id}`, { name });
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Tag/${id}`);
    }
};
