import type { ExecutionError } from "./CodeAnalysis";

export interface TestResult {
    testCaseId: string;
    passed: boolean;
    points: number;
    executionTimeMs: number;
    stdOut: string | null;
    stdErr: string | null;
    errors: ExecutionError[] | null;
    isVisible: boolean;
    inputJson: string | null;
    expectedJson: string | null;
    returnedValue: string | null;
    exitCode: number;
}