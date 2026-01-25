import apiClient from "../apiClient";
import type { SubmissionResponse, SubmissionRequest } from "./types";

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