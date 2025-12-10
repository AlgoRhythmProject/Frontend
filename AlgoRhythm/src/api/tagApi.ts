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
    }
};
