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
    status: string;        // Pending, Accepted, Rejected, Error
    score: number | null;
    isSolved: boolean;
    submittedAt: string;
    testResults: TestResult[];
    errorMessage: string | null;
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
};