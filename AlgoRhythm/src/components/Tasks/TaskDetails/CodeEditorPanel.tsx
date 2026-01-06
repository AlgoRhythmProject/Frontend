import { useState } from "react";
import { Play, RotateCcw, Lightbulb, ChevronDown } from "lucide-react";
import { TestResults } from "./TestResults";
import { HintsPanelContent } from "./HintsPanelContent";
import type { TestResult } from "@/types/TestResult";
import { CodeEditor } from "@/components/CodeEditor";

interface CodeEditorPanelProps {
    taskId: string;
    code: string;
    onCodeChange: (code: string) => void;
    onReset: () => void;
    onRunCode: () => void;
    isRunning: boolean;
    testResults: TestResult[] | null;
    runStatus: string | null;
    errorMsg: string | null;
}

export function CodeEditorPanel({
    taskId,
    code,
    onCodeChange,
    onReset,
    onRunCode,
    isRunning,
    testResults,
    runStatus,
    errorMsg
}: CodeEditorPanelProps) {
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showHintsPanel, setShowHintsPanel] = useState(false);

    const handleReset = () => setShowResetConfirm(true);
    const confirmReset = () => {
        onReset();
        setShowResetConfirm(false);
    };
    const cancelReset = () => setShowResetConfirm(false);

    return (
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-background border-l border-muted">
            {/* Backdrop for confirmation */}
            {showResetConfirm && (
                <div
                    className="fixed inset-0 z-40 cursor-pointer"
                    onClick={cancelReset}
                    onKeyDown={(e) => e.key === "Escape" && cancelReset()}
                    role="button"
                    tabIndex={0}
                    aria-label="Close confirmation dialog"
                />
            )}

            {/* Editor Header */}
            <div className="border-b border-muted px-6 py-3 flex items-center justify-between">
                <p className="font-sans font-medium text-foreground">Code Editor</p>
                <div className="flex gap-2 relative">
                    {/* Hints Button */}
                    <button
                        onClick={() => setShowHintsPanel(!showHintsPanel)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${showHintsPanel
                            ? "bg-warning/20 text-warning hover:bg-warning/30"
                            : "bg-card-hover hover:bg-muted text-foreground"
                            }`}
                    >
                        <Lightbulb className="w-4 h-4" />
                        Hints
                        <ChevronDown className={`w-4 h-4 transition-transform ${showHintsPanel ? "rotate-180" : ""}`} />
                    </button>

                    {/* Reset Button */}
                    <div className="relative">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-card-hover hover:bg-muted text-foreground rounded-lg transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>

                        {showResetConfirm && (
                            <div className="absolute top-full mt-2 right-0 bg-background border border-muted rounded-lg shadow-xl p-4 w-72 z-50">
                                <p className="font-sans text-foreground text-sm mb-3">
                                    Are you sure? All progress will be lost.
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={cancelReset}
                                        className="px-3 py-1.5 text-sm bg-card-hover hover:bg-muted text-foreground rounded transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmReset}
                                        className="px-3 py-1.5 text-sm bg-primary hover:bg-primary-hover text-foreground rounded transition-colors cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Run Code Button */}
                    <button
                        onClick={onRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <Play className="w-4 h-4" />
                        {isRunning ? "Running..." : "Run Code"}
                    </button>
                </div>
            </div>

            {/* Hints Panel (collapsible) */}
            {showHintsPanel && (
                <div className="border-b border-muted bg-card p-4 max-h-80 overflow-y-auto">
                    <HintsPanelContent taskId={taskId} />
                </div>
            )}

            {/* Code Editor Area */}
            <div className="flex-1 overflow-hidden">
                <CodeEditor
                    value={code}
                    onChange={(value: any) => onCodeChange(value || "")}
                    language="csharp"
                />
            </div>

            {/* Error Display */}
            {errorMsg && (
                <div className="border-t border-error p-6 bg-error/10 max-h-64 overflow-auto">
                    <h3 className="font-sans font-medium text-error mb-2">Error</h3>
                    <pre className="whitespace-pre-wrap text-error text-sm">{errorMsg}</pre>
                </div>
            )}

            {/* Test Results */}
            {testResults && testResults.length > 0 && !errorMsg && runStatus && (
                <TestResults testResults={testResults} runStatus={runStatus} />
            )}
        </div>
    );
}
