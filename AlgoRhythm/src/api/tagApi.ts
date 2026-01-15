import apiClient from "./apiClient";

export interface Tag {
    id: string;
    name: string;
    description: string;
}

export interface CreateTagRequest {
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

    create: async (name: string, description: string = ""): Promise<Tag> => {
        const payload: CreateTagRequest = { name, description };
        const res = await apiClient.post<Tag>("/Tag", payload);
        return res.data;
    },

    update: async (id: string, name: string, description: string = ""): Promise<void> => {
        const payload: CreateTagRequest = { name, description };
        await apiClient.put(`/Tag/${id}`, payload);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Tag/${id}`);
    }
};