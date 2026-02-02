export interface TestCase {
    id: string;
    programmingTaskItemId: string;
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
    timeoutMs: number | null;
}