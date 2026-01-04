import type { TestResult } from "@/types/TestResult";
import { Check, X } from "lucide-react";

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
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg ${r.passed
                            ? "bg-success/10 border border-success/30"
                            : "bg-error/10 border border-error/30"
                            }`}
                    >
                        {r.passed ? (
                            <Check className="w-5 h-5 text-success" />
                        ) : (
                            <X className="w-5 h-5 text-error" />
                        )}
                        <div className="flex flex-col flex-1">
                            <p className="font-sans text-sm text-foreground">
                                Test {idx + 1} • {r.executionTimeMs.toFixed(2)}ms
                            </p>
                            <p
                                className={`font-sans text-sm ${r.passed ? "text-success" : "text-error"
                                    }`}
                            >
                                {r.passed ? "Passed" : "Failed"} • {r.points} points
                            </p>
                            {r.stdErr && (
                                <p className="font-mono text-error text-xs mt-1">
                                    Error: {r.stdErr}
                                </p>
                            )}
                            {r.stdOut && (
                                <p className="font-mono text-success text-xs mt-1">
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