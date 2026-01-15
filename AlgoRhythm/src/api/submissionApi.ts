import type { TestResult } from "@/types/TestResult";
import apiClient from "./apiClient";

export interface SubmissionRequest {
    taskId: string;
    code: string;
}

export interface SubmissionResponse {
    submissionId: string;
    taskItemId: string;
    userId: string;
    status: string;
    score: number | null;
    isSolved: boolean;
    submittedAt: string;
    testResults: TestResult[];
    errorMessage: string | null;
}

export interface SubmissionHistoryItem {
    id: string;
    taskItemId: string;
    taskTitle: string | null;
    status: string;
    score: number | null;
    submittedAt: string;
    isSolved: boolean;
}

export const submissionApi = {
    submit: async (taskId: string, code: string): Promise<SubmissionResponse> => {
        const payload: SubmissionRequest = { taskId, code };
        const res = await apiClient.post<SubmissionResponse>("/Submissions/programming", payload);
        return res.data;
    },

    getResult: async (submissionId: string): Promise<SubmissionResponse> => {
        const res = await apiClient.get<SubmissionResponse>(`/Submissions/${submissionId}`);
        return res.data;
    },

    getMySubmissions: async (): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>("/Submissions/my-submissions");
        return res.data;
    },

    getMySubmissionsForTask: async (taskId: string): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>(`/Submissions/my-submissions/task/${taskId}`);
        return res.data;
    },

    getAllSubmissions: async (): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>("/Submissions/all");
        return res.data;
    },

    getRecentSubmissions: async (page: number = 1, pageSize: number = 20): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>(
            `/Submissions/recent?page=${page}&pageSize=${pageSize}`
        );
        return res.data;
    },
};