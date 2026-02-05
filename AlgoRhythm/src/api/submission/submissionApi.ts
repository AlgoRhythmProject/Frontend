import apiClient from "../apiClient";
import type { SubmissionResponse, SubmissionRequest } from "./types";

const mapStatusToString = (status: string | number): string => {
    if (typeof status === 'string') return status;

    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Accepted';
        case 2:
            return 'Rejected';
        default:
            return 'Pending';
    }
};

const normalizeSubmissionResponse = (response: SubmissionResponse): SubmissionResponse => {
    return {
        ...response,
        status: mapStatusToString(response.status)
    };
};

export const submissionApi = {
    submit: async (taskId: string, code: string): Promise<SubmissionResponse> => {
        const payload: SubmissionRequest = { taskId, code };
        const res = await apiClient.post<SubmissionResponse>("/Submissions/programming", payload);
        return normalizeSubmissionResponse(res.data);
    },

    getResult: async (submissionId: string): Promise<SubmissionResponse> => {
        const res = await apiClient.get<SubmissionResponse>(`/Submissions/${submissionId}`);
        return normalizeSubmissionResponse(res.data);
    },

    getMySubmissions: async (): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>("/Submissions/my-submissions");
        return res.data.map(normalizeSubmissionResponse);
    },

    getMySubmissionsForTask: async (taskId: string): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>(`/Submissions/my-submissions/task/${taskId}`);
        return res.data.map(normalizeSubmissionResponse);
    },

    getAllSubmissions: async (): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>("/Submissions/all");
        return res.data.map(normalizeSubmissionResponse);
    },

    getRecentSubmissions: async (page: number = 1, pageSize: number = 20): Promise<SubmissionResponse[]> => {
        const res = await apiClient.get<SubmissionResponse[]>(
            `/Submissions/recent?page=${page}&pageSize=${pageSize}`
        );
        return res.data.map(normalizeSubmissionResponse);
    },
};