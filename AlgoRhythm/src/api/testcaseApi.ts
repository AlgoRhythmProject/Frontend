import apiClient from "./apiClient";

export interface TestCase {
    id: string;
    programmingTaskItemId: string;
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
}

export interface CreateTestCaseDto {
    programmingTaskItemId: string;
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
}

export interface UpdateTestCaseDto {
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
}

export const testCaseApi = {
    getAll: async (): Promise<TestCase[]> => {
        const response = await apiClient.get<TestCase[]>('/TestCase');
        return response.data;
    },

    getByTaskId: async (taskId: string): Promise<TestCase[]> => {
        const response = await apiClient.get<TestCase[]>(`/TestCase/task/${taskId}`);
        return response.data;
    },

    getById: async (id: string): Promise<TestCase> => {
        const response = await apiClient.get<TestCase>(`/TestCase/${id}`);
        return response.data;
    },

    create: async (dto: CreateTestCaseDto): Promise<TestCase> => {
        const response = await apiClient.post<TestCase>('/TestCase', dto);
        return response.data;
    },

    update: async (id: string, dto: UpdateTestCaseDto): Promise<TestCase> => {
        const response = await apiClient.put<TestCase>(`/TestCase/${id}`, dto);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/TestCase/${id}`);
    },
};