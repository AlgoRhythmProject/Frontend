export interface TestResult {
    testCaseId: string;
    passed: boolean;
    points: number;
    executionTimeMs: number;
    stdOut: string | null;
    stdErr: string | null;
}
