import { useState } from 'react';
import { MessageSquare, User, FileCode, Calendar, Search } from 'lucide-react';
import type { Comment } from '@/types/Comment';
import type { Task } from '@/types/Task';

interface CommentsTabProps {
    comments: Comment[];
    tasks: Task[];
    loading: boolean;
}

export function CommentsTab({ comments, tasks, loading }: CommentsTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState<'all' | 'task' | 'user'>('all');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [selectedAuthorName, setSelectedAuthorName] = useState<string>('');

    // Get unique authors from comments
    const uniqueAuthors = Array.from(
        new Set(comments.map(c => c.authorName || 'Unknown User').filter(Boolean))
    ).sort();

    // Filter comments based on search and filters
    const filteredComments = comments.filter(comment => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesContent = comment.content.toLowerCase().includes(query);
            const matchesAuthor = (comment.authorName || '').toLowerCase().includes(query);
            const matchesTask = tasks
                .find(t => t.id === comment.taskItemId)
                ?.title.toLowerCase()
                .includes(query);

            if (!matchesContent && !matchesAuthor && !matchesTask) {
                return false;
            }
        }

        // Task filter
        if (filterBy === 'task' && selectedTaskId && comment.taskItemId !== selectedTaskId) {
            return false;
        }

        // User filter
        if (filterBy === 'user' && selectedAuthorName && comment.authorName !== selectedAuthorName) {
            return false;
        }

        return true;
    });

    // Sort by newest first
    const sortedComments = [...filteredComments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div>
            <div className="p-6 border-b border-muted">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-sans font-medium text-foreground text-xl">Comment Monitoring</h2>
                        <p className="font-sans text-sm text-muted-foreground mt-1">
                            View and monitor all user comments across tasks
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-primary/30 rounded-lg flex items-center gap-3">
                        <p className="font-sans font-medium text-foreground text-2xl">{comments.length}</p>
                        <p className="font-sans text-sm text-muted-foreground">Total Comments</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search comments, users, or tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>

                    {/* Filter Type */}
                    <select
                        value={filterBy}
                        onChange={(e) => {
                            setFilterBy(e.target.value as 'all' | 'task' | 'user');
                            setSelectedTaskId('');
                        }}
                        className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="all">All Comments</option>
                        <option value="task">Filter by Task</option>
                        <option value="user">Filter by User</option>
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
                            value={selectedAuthorName}
                            onChange={(e) => setSelectedAuthorName(e.target.value)}
                            className="px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="">Select a user...</option>
                            {uniqueAuthors.map(name => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">
                    <p className="font-sans text-muted-foreground">Loading comments...</p>
                </div>
            ) : sortedComments.length === 0 ? (
                <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="font-sans text-muted-foreground">
                        {comments.length === 0 ? 'No comments yet.' : 'No comments match your filters.'}
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-muted">
                    {sortedComments.map((comment) => (
                        <div key={comment.id} className="p-6 hover:bg-background/50 transition-colors">
                            <div className="flex items-start gap-4">
                                {/* Avatar placeholder */}
                                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-sans font-medium text-foreground">
                                                    {comment.authorName || 'Unknown User'}
                                                </span>
                                                <span className="text-muted-foreground">•</span>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-sans text-sm">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>
                                                {comment.isEdited && (
                                                    <>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="font-sans text-sm text-muted-foreground italic">
                                                            edited
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Task reference */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <FileCode className="w-3 h-3 text-info" />
                                                <span className="font-sans text-sm text-info">
                                                    {getTaskTitle(comment.taskItemId)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comment ID badge */}
                                        <div className="shrink-0">
                                            <span className="px-2 py-1 bg-muted rounded text-xs font-mono text-muted-foreground">
                                                #{comment.id.slice(0, 8)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-3 font-sans text-foreground whitespace-pre-wrap wrap-break-word">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results summary */}
            {!loading && sortedComments.length > 0 && (
                <div className="p-4 border-t border-muted text-center">
                    <p className="font-sans text-sm text-muted-foreground">
                        Showing {sortedComments.length} of {comments.length} comments
                    </p>
                </div>
            )}
        </div>
    );
}
