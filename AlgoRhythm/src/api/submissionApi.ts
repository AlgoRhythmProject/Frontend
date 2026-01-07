import apiClient from "./apiClient";
import type {ExecutionError} from "@/types/CodeAnalysis.ts";

export interface SubmissionRequest {
    taskId: string;
    code: string;
}

export interface TestResult {
    testCaseId: string;
    passed: boolean;
    points: number;
    executionTimeMs: number;
    stdOut: string | null;
    stdErr: string | null;
    errors: ExecutionError[] | null
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