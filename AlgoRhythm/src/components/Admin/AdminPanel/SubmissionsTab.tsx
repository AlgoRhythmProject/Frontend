import { useState } from 'react';
import { Code, User, FileCode, Calendar, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Task } from '@/types/Task';
import type { SubmissionResponse } from '@/api/submission/types';

interface SubmissionsTabProps {
    submissions: SubmissionResponse[];
    tasks: Task[];
    loading: boolean;
}

export function SubmissionsTab({ submissions, tasks, loading }: SubmissionsTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState<'all' | 'task' | 'user' | 'status'>('all');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // Get unique users from submissions
    const uniqueUsers = Array.from(
        new Map(submissions.map(s => [s.userId, s.userId])).values()
    ).sort();

    // Get unique statuses
    const uniqueStatuses = Array.from(
        new Set(submissions.map(s => s.status))
    ).sort();

    // Filter submissions
    const filteredSubmissions = submissions.filter(submission => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTask = tasks
                .find(t => t.id === submission.taskItemId)
                ?.title.toLowerCase()
                .includes(query);
            const matchesUser = submission.userId.toLowerCase().includes(query);
            const matchesStatus = submission.status.toLowerCase().includes(query);

            if (!matchesTask && !matchesUser && !matchesStatus) {
                return false;
            }
        }

        // Task filter
        if (filterBy === 'task' && selectedTaskId && submission.taskItemId !== selectedTaskId) {
            return false;
        }

        // User filter
        if (filterBy === 'user' && selectedUserId && submission.userId !== selectedUserId) {
            return false;
        }

        // Status filter
        if (filterBy === 'status' && selectedStatus && submission.status !== selectedStatus) {
            return false;
        }

        return true;
    });

    // Sort by newest first
    const sortedSubmissions = [...filteredSubmissions].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Get task title by ID
    const getTaskTitle = (taskItemId: string) => {
        return tasks.find(t => t.id === taskItemId)?.title || 'Unknown Task';
    };

    // Format date
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

    // Get status icon
    const getStatusIcon = (status: string, isSolved: boolean) => {
        if (isSolved || status === 'Accepted') {
            return <CheckCircle2 className="w-5 h-5 text-success" />;
        }
        if (status === 'Rejected' || status === 'Error') {
            return <XCircle className="w-5 h-5 text-error" />;
        }
        return <Clock className="w-5 h-5 text-warning" />;
    };

    // Get status color
    const getStatusColor = (status: string, isSolved: boolean) => {
        if (isSolved || status === 'Accepted') return 'bg-success/20 text-success';
        if (status === 'Rejected' || status === 'Error') return 'bg-error/20 text-error';
        return 'bg-warning/20 text-warning';
    };

    // Calculate stats
    const acceptedCount = submissions.filter(s => s.isSolved || s.status === 'Accepted').length;
    const rejectedCount = submissions.filter(s => s.status === 'Rejected' || s.status === 'Error').length;
    const averageScore = submissions.length > 0
        ? submissions.filter(s => s.score !== null).reduce((acc, s) => acc + (s.score || 0), 0) / submissions.filter(s => s.score !== null).length
        : 0;

    return (
        <div>
            <div className="p-6 border-b border-muted">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-sans font-medium text-foreground text-xl">Submission Monitoring</h2>
                        <p className="font-sans text-sm text-muted-foreground mt-1">
                            View and monitor all user submissions across tasks
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="px-4 py-2 bg-primary/10 rounded-lg">
                        <p className="font-sans text-sm text-muted-foreground">Total</p>
                        <p className="font-sans font-medium text-foreground text-2xl">{submissions.length}</p>
                    </div>
                    <div className="px-4 py-2 bg-success/10 rounded-lg">
                        <p className="font-sans text-sm text-muted-foreground">Accepted</p>
                        <p className="font-sans font-medium text-success text-2xl">{acceptedCount}</p>
                    </div>
                    <div className="px-4 py-2 bg-error/10 rounded-lg">
                        <p className="font-sans text-sm text-muted-foreground">Rejected</p>
                        <p className="font-sans font-medium text-error text-2xl">{rejectedCount}</p>
                    </div>
                    <div className="px-4 py-2 bg-info/10 rounded-lg">
                        <p className="font-sans text-sm text-muted-foreground">Avg Score</p>
                        <p className="font-sans font-medium text-info text-2xl">
                            {averageScore > 0 ? `${Math.round(averageScore)}%` : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search submissions, users, or tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>

                    {/* Filter Type */}
                    <select
                        value={filterBy}
                        onChange={(e) => {
                            setFilterBy(e.target.value as 'all' | 'task' | 'user' | 'status');
                            setSelectedTaskId('');
                            setSelectedUserId('');
                            setSelectedStatus('');
                        }}
                        className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="all">All Submissions</option>
                        <option value="task">Filter by Task</option>
                        <option value="user">Filter by User</option>
                        <option value="status">Filter by Status</option>
                    </select>

                    {/* Task Filter */}
                    {filterBy === 'task' && (
                        <select
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="">Select a task...</option>
                            {tasks.map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* User Filter */}
                    {filterBy === 'user' && (
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="">Select a user...</option>
                            {uniqueUsers.map(userId => (
                                <option key={userId} value={userId}>
                                    {userId.slice(0, 8)}...
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Status Filter */}
                    {filterBy === 'status' && (
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="">Select a status...</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">
                    <p className="font-sans text-muted-foreground">Loading submissions...</p>
                </div>
            ) : sortedSubmissions.length === 0 ? (
                <div className="p-8 text-center">
                    <Code className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="font-sans text-muted-foreground">
                        {submissions.length === 0 ? 'No submissions yet.' : 'No submissions match your filters.'}
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-muted">
                    {sortedSubmissions.map((submission) => (
                        <div key={submission.submissionId} className="p-6 hover:bg-background/50 transition-colors">
                            <div className="flex items-start gap-4">
                                {/* Status Icon */}
                                <div className="shrink-0">
                                    {getStatusIcon(submission.status, submission.isSolved)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <FileCode className="w-4 h-4 text-info" />
                                                <span className="font-sans font-medium text-foreground">
                                                    {getTaskTitle(submission.taskItemId)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <User className="w-3 h-3" />
                                                    <span className="font-sans text-sm">
                                                        {submission.userId.slice(0, 8)}...
                                                    </span>
                                                </div>
                                                <span className="text-muted-foreground">•</span>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-sans text-sm">
                                                        {formatDate(submission.submittedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status and Score */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {submission.score !== null && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-sans font-medium">
                                                    {Math.round(submission.score)}%
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${getStatusColor(submission.status, submission.isSolved)}`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Test Results Summary */}
                                    {submission.testResults && submission.testResults.length > 0 && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="font-sans text-sm text-muted-foreground">
                                                Tests:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-sans text-sm text-success">
                                                    {submission.testResults.filter(t => t.passed).length}
                                                </span>
                                                <span className="font-sans text-sm text-muted-foreground">/</span>
                                                <span className="font-sans text-sm text-muted-foreground">
                                                    {submission.testResults.length}
                                                </span>
                                                <span className="font-sans text-sm text-muted-foreground">passed</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {submission.errorMessage && (
                                        <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                                            <p className="font-sans text-sm text-error">
                                                {submission.errorMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results summary */}
            {!loading && sortedSubmissions.length > 0 && (
                <div className="p-4 border-t border-muted text-center">
                    <p className="font-sans text-sm text-muted-foreground">
                        Showing {sortedSubmissions.length} of {submissions.length} submissions
                    </p>
                </div>
            )}
        </div>
    );
}
