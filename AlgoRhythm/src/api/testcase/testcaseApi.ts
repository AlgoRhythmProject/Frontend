import type { TestCase } from "@/types/TestCase";
import apiClient from "../apiClient";
import type { CreateTestCaseDto, UpdateTestCaseDto } from "./types";

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