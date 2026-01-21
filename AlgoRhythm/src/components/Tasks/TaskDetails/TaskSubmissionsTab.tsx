import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { submissionApi } from '@/api/submission/submissionApi';
import type { TestResult } from '@/types/TestResult';
import type { SubmissionResponse } from '@/api/submission/types';

interface TaskSubmissionsTabProps {
    taskId: string;
}

export function TaskSubmissionsTab({ taskId }: TaskSubmissionsTabProps) {
    const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

    useEffect(() => {
        loadSubmissions();
    }, [taskId]);

    const loadSubmissions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await submissionApi.getMySubmissionsForTask(taskId);

            // Sort by newest first
            const sorted = data.sort(
                (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );

            setSubmissions(sorted);
        } catch (err) {
            console.error('Failed to load submissions:', err);
            setError('Failed to load submission history');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string, isSolved: boolean) => {
        if (isSolved || status === 'Accepted') {
            return <CheckCircle2 className="w-5 h-5 text-success" />;
        }
        if (status === 'Rejected' || status === 'Error') {
            return <XCircle className="w-5 h-5 text-error" />;
        }
        return <Clock className="w-5 h-5 text-warning" />;
    };

    const getStatusColor = (status: string, isSolved: boolean) => {
        if (isSolved || status === 'Accepted') return 'text-success bg-success/10 border-success/20';
        if (status === 'Rejected' || status === 'Error') return 'text-error bg-error/10 border-error/20';
        return 'text-warning bg-warning/10 border-warning/20';
    };

    const getStatusBadgeColor = (status: string, isSolved: boolean) => {
        if (isSolved || status === 'Accepted') return 'bg-success/20 text-success';
        if (status === 'Rejected' || status === 'Error') return 'bg-error/20 text-error';
        return 'bg-warning/20 text-warning';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleExpanded = (submissionId: string) => {
        setExpandedSubmissionId(expandedSubmissionId === submissionId ? null : submissionId);
    };

    const getTestStatusIcon = (test: TestResult) => {
        if (test.passed) {
            return <CheckCircle2 className="w-4 h-4 text-success" />;
        }
        return <XCircle className="w-4 h-4 text-error" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="font-sans text-error">{error}</p>
                <button
                    onClick={loadSubmissions}
                    className="mt-4 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary-hover transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className="text-center py-12">
                <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-sans font-medium text-foreground text-lg mb-2">
                    No submissions yet
                </h3>
                <p className="font-sans text-muted-foreground text-sm">
                    Run your code to see your submission history here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-medium text-foreground text-lg">
                    Your Submissions ({submissions.length})
                </h3>
            </div>

            {submissions.map((submission) => {
                const isExpanded = expandedSubmissionId === submission.submissionId;
                const hasTests = submission.testResults && submission.testResults.length > 0;
                const passedTests = hasTests
                    ? submission.testResults.filter(t => t.passed).length
                    : 0;
                const totalTests = submission.testResults?.length || 0;

                return (
                    <div
                        key={submission.submissionId}
                        className={`border rounded-lg overflow-hidden transition-all ${getStatusColor(submission.status, submission.isSolved)
                            }`}
                    >
                        {/* Header - Always visible */}
                        <div
                            onClick={() => toggleExpanded(submission.submissionId)}
                            className="p-4 cursor-pointer hover:bg-background/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {getStatusIcon(submission.status, submission.isSolved)}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`px-2 py-1 rounded text-xs font-sans font-medium ${getStatusBadgeColor(submission.status, submission.isSolved)
                                            }`}>
                                            {submission.status}
                                        </span>

                                        {submission.score !== null && (
                                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-sans font-medium rounded">
                                                Score: {Math.round(submission.score)}%
                                            </span>
                                        )}

                                        {hasTests && (
                                            <span className="px-2 py-1 bg-muted text-foreground text-xs font-sans font-medium rounded">
                                                {passedTests}/{totalTests} tests passed
                                            </span>
                                        )}
                                    </div>

                                    <p className="font-sans text-sm text-muted-foreground">
                                        {formatDate(submission.submittedAt)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="border-t border-current/20 bg-background/30">
                                {/* Error Message */}
                                {submission.errorMessage && (
                                    <div className="p-4 border-b border-current/20">
                                        <p className="font-sans text-sm font-medium text-error mb-2">Error:</p>
                                        <div className="bg-error/10 border border-error/20 rounded p-3">
                                            <p className="font-mono text-sm text-error whitespace-pre-wrap">
                                                {submission.errorMessage}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Test Results */}
                                {hasTests && (
                                    <div className="p-4">
                                        <p className="font-sans text-sm font-medium text-foreground mb-3">
                                            Test Results:
                                        </p>
                                        <div className="space-y-2">
                                            {submission.testResults.map((test, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border ${test.passed
                                                        ? 'bg-success/5 border-success/20'
                                                        : 'bg-error/5 border-error/20'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {getTestStatusIcon(test)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-sans text-sm font-medium text-foreground mb-1">
                                                                Test Case {idx + 1} {test.testCaseId ? `(ID: ${test.testCaseId.slice(0, 8)})` : ''}
                                                            </p>

                                                            {/* Points and Execution Time */}
                                                            <div className="flex items-center gap-4 mb-2 text-xs text-muted-foreground">
                                                                <span className="font-sans">
                                                                    Points: <span className="font-medium text-foreground">{test.points}</span>
                                                                </span>
                                                                <span className="font-sans">
                                                                    Time: <span className="font-medium text-foreground">{test.executionTimeMs}ms</span>
                                                                </span>
                                                            </div>

                                                            {/* Standard Output */}
                                                            {test.stdOut && (
                                                                <div className="mt-2">
                                                                    <p className="font-sans text-xs text-muted-foreground mb-1">Output:</p>
                                                                    <div className={`font-mono text-xs p-2 rounded max-h-32 overflow-auto ${test.passed
                                                                        ? 'text-success bg-success/10 border border-success/20'
                                                                        : 'text-foreground bg-background/50 border border-muted'
                                                                        }`}>
                                                                        <pre className="whitespace-pre-wrap">{test.stdOut}</pre>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Standard Error */}
                                                            {test.stdErr && (
                                                                <div className="mt-2">
                                                                    <p className="font-sans text-xs text-error mb-1">Error Output:</p>
                                                                    <div className="font-mono text-xs text-error bg-error/10 border border-error/20 p-2 rounded max-h-32 overflow-auto">
                                                                        <pre className="whitespace-pre-wrap">{test.stdErr}</pre>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Execution Errors */}
                                                            {test.errors && test.errors.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="font-sans text-xs text-error mb-1">Errors:</p>
                                                                    <div className="space-y-1">
                                                                        {test.errors.map((error, errorIdx) => (
                                                                            <div
                                                                                key={errorIdx}
                                                                                className="font-mono text-xs text-error bg-error/10 border border-error/20 p-2 rounded"
                                                                            >
                                                                                <p className="font-sans text-xs font-medium mb-1">
                                                                                    Line {error.startLine}, Column {error.startColumn}
                                                                                </p>
                                                                                <pre className="whitespace-pre-wrap">{error.errorMessage}</pre>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Submission ID for reference */}
                                <div className="p-3 border-t border-current/20 bg-background/20">
                                    <p className="font-mono text-xs text-muted-foreground">
                                        ID: {submission.submissionId}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
