import apiClient from "./apiClient";

export interface Task {
    id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    tags: string[];
    courseId?: string;
    completed: boolean;
    starterCode: string;
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    constraints: string[];
}

export interface TaskListResponse {
    tasks: Task[];
    totalCount: number;
}

export const taskApi = {
    // Pobierz wszystkie taski
    getAll: async (): Promise<Task[]> => {
        const res = await apiClient.get<Task[]>("/Task");
        return res.data;
    },

    // Pobierz jeden task po ID
    getById: async (id: string): Promise<Task> => {
        const res = await apiClient.get<Task>(`/Task/${id}`);
        return res.data;
    },
};