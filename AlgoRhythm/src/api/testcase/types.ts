export interface CreateTestCaseDto {
    programmingTaskItemId: string;
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
    timeoutMs: number | null;
}

export interface UpdateTestCaseDto {
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
    timeoutMs: number | null;
}