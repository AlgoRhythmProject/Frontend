import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Code, ChevronRight } from 'lucide-react';
import { submissionApi, type SubmissionHistoryItem } from '@/api/submissionApi';
import { useNavigate } from 'react-router-dom';

interface RecentSubmissionsProps {
    limit?: number;
}

export function RecentSubmissions({ limit = 5 }: RecentSubmissionsProps) {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<SubmissionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await submissionApi.getMySubmissions();

            // Map to history items and sort by date
            const historyItems: SubmissionHistoryItem[] = data
                .map(sub => ({
                    id: sub.submissionId,
                    taskItemId: sub.taskItemId,
                    taskTitle: null, // Backend może nie zwracać, możesz to rozbudować
                    status: sub.status,
                    score: sub.score,
                    submittedAt: sub.submittedAt,
                    isSolved: sub.isSolved,
                }))
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .slice(0, limit);

            setSubmissions(historyItems);
        } catch (err) {
            console.error('Failed to load submissions:', err);
            setError('Failed to load recent submissions');
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
        if (isSolved || status === 'Accepted') return 'text-success';
        if (status === 'Rejected' || status === 'Error') return 'text-error';
        return 'text-warning';
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
        return date.toLocaleDateString();
    };

    const handleSubmissionClick = (taskId: string) => {
        navigate(`/tasks/${taskId}`);
    };

    if (isLoading) {
        return (
            <div className="bg-card border border-muted rounded-xl p-6">
                <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                    Recent Submissions
                </h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-card border border-muted rounded-xl p-6">
                <h2 className="font-sans font-medium text-foreground text-xl mb-4">
                    Recent Submissions
                </h2>
                <div className="text-center py-8">
                    <p className="font-sans text-error text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-sans font-medium text-foreground text-xl">
                    Recent Submissions
                </h2>
                <Code className="w-5 h-5 text-primary" />
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-8">
                    <Code className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="font-sans text-muted-foreground text-sm">
                        No submissions yet. Start solving tasks!
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {submissions.map((submission) => (
                        <div
                            key={submission.id}
                            onClick={() => handleSubmissionClick(submission.taskItemId)}
                            className="p-4 bg-background hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                {getStatusIcon(submission.status, submission.isSolved)}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-sans font-medium text-foreground truncate">
                                            {submission.taskTitle || `Task ${submission.taskItemId.slice(0, 8)}`}
                                        </p>
                                        {submission.score !== null && (
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-sans font-medium rounded">
                                                {Math.round(submission.score)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`font-sans font-medium ${getStatusColor(submission.status, submission.isSolved)}`}>
                                            {submission.status}
                                        </span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="font-sans text-muted-foreground">
                                            {formatDate(submission.submittedAt)}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {submissions.length > 0 && (
                <button
                    onClick={() => navigate('/tasks')}
                    className="w-full mt-4 px-4 py-2 text-center font-sans text-sm text-primary hover:text-primary-hover transition-colors"
                >
                    View all tasks →
                </button>
            )}
        </div>
    );
}