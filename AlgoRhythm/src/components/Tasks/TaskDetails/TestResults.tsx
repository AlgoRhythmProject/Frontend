import type { TestResult } from "@/types/TestResult";
import { Check, X, AlertCircle } from "lucide-react";

interface TestResultsProps {
    testResults: TestResult[];
    runStatus: string;
}

export function TestResults({ testResults, runStatus }: TestResultsProps) {
    if (testResults.length === 0) return null;

    return (
        <div className="border-t border-muted p-6 bg-background max-h-64 overflow-auto">
            <h3 className="font-sans font-medium text-foreground mb-4">
                Results ({runStatus})
            </h3>
            <div className="space-y-2">
                {testResults.map((r, idx) => (
                    <div
                        key={r.testCaseId}
                        className={`flex items-start gap-3 p-3 rounded-lg ${r.passed
                            ? "bg-success/10 border border-success/30"
                            : "bg-error/10 border border-error/30"
                            }`}
                    >
                        {r.passed ? (
                            <Check className="w-5 h-5 text-success mt-0.5" />
                        ) : (
                            <X className="w-5 h-5 text-error mt-0.5" />
                        )}
                        <div className="flex flex-col flex-1 gap-1">
                            <div className="flex items-center gap-2">
                                <p className="font-sans text-sm text-foreground">
                                    Test {idx + 1} • {r.executionTimeMs.toFixed(2)}ms
                                </p>

                            </div>
                            <p
                                className={`font-sans text-sm ${r.passed ? "text-success" : "text-error"
                                    }`}
                            >
                                {r.passed ? "Passed" : "Failed"} • {r.points} points
                            </p>
                            {/* Display execution errors */}
                            {r.errors && r.errors.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {r.errors.map((err, errIdx) => (
                                        <div
                                            key={errIdx}
                                            className="flex items-start gap-2 bg-error/20 p-2 rounded border border-error/40"
                                        >
                                            <AlertCircle className="w-4 h-4 text-error mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-mono text-error text-xs">
                                                    {err.errorMessage}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Display stderr */}
                            {r.stdErr && (
                                <p className="font-mono text-error text-xs mt-1 p-2 bg-error/10 rounded">
                                    Error: {r.stdErr}
                                </p>
                            )}
                            {/* Display stdout */}
                            {r.stdOut && (
                                <p className="font-mono text-success text-xs mt-1 p-2 bg-success/10 rounded">
                                    Output: {r.stdOut}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}