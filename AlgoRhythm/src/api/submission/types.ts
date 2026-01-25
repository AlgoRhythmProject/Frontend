import type { TestResult } from "@/types/TestResult";

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
