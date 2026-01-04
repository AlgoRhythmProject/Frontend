import { useState, useEffect } from "react";
import { Loader2, Send, Edit2, Trash2, X, Check } from "lucide-react";
import { commentApi } from "@/api/commentApi";
import type { Comment, CommentInputDto } from "@/types/Comment";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

interface CommentsSectionProps {
    taskId: string;
    currentUserId?: string; // Do sprawdzenia czy użytkownik może edytować/usuwać
}

export function CommentsSection({ taskId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await commentApi.getByTaskId(taskId);
            // Sortuj od najnowszych
            setComments(data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (err: any) {
            console.error("Failed to fetch comments:", err);
            setError(err.response?.data?.error || "Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const dto: CommentInputDto = {
                taskItemId: taskId, // ← Poprawione pole
                content: newComment.trim()
            };

            console.log("📤 Sending comment:", dto);
            const result = await commentApi.create(dto);
            console.log("✅ Comment created:", result);

            setNewComment("");
            await fetchComments(); // Odśwież listę
        } catch (err: any) {
            console.error("❌ Failed to create comment:", err);
            console.error("Error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            // Pokaż bardziej szczegółowy błąd
            const errorMsg = err.response?.data?.error
                || err.response?.data?.message
                || err.response?.data?.title
                || err.message
                || "Failed to post comment";

            alert(`Error posting comment:\n${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleSaveEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            await commentApi.update(commentId, editContent.trim());
            await fetchComments();
            setEditingId(null);
            setEditContent("");
        } catch (err: any) {
            console.error("Failed to update comment:", err);
            alert(err.response?.data?.error || "Failed to update comment");
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            await commentApi.delete(commentId);
            await fetchComments();
        } catch (err: any) {
            console.error("Failed to delete comment:", err);
            alert(err.response?.data?.error || "Failed to delete comment");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const user = useSelector((state: RootState) => state.user.user);


    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-error mb-4">{error}</p>
                <button
                    onClick={fetchComments}
                    className="text-primary hover:underline text-sm"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="bg-card border border-muted rounded-lg p-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts, ask questions, or discuss solutions..."
                    className="w-full bg-background text-foreground border border-muted rounded-lg p-3 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
                    disabled={isSubmitting}
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">No comments yet</p>
                        <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-card border border-muted rounded-lg p-4"
                        >
                            {/* Comment Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Avatar placeholder */}
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-sans font-medium text-sm">
                                            {comment.authorName?.[0]?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-sans font-medium text-foreground text-sm">
                                            {comment.authorName || "Anonymous User"}
                                        </p>
                                        <p className="font-sans text-muted-foreground text-xs">
                                            {formatDate(comment.createdAt)}
                                            {comment.isEdited && " (edited)"}
                                        </p>
                                    </div>
                                </div>

                                {/* Edit/Delete buttons (tylko dla własnych komentarzy) */}
                                {user?.id === comment.authorId && (
                                    <div className="flex gap-2">
                                        {editingId === comment.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(comment.id)}
                                                    className="p-1.5 hover:bg-success/20 text-success rounded transition-colors"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1.5 hover:bg-error/20 text-error rounded transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(comment)}
                                                    className="p-1.5 hover:bg-card-hover text-muted-foreground hover:text-foreground rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="p-1.5 hover:bg-error/20 text-error rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comment Content */}
                            {editingId === comment.id ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-background text-foreground border border-muted rounded-lg p-3 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
                                />
                            ) : (
                                <p className="font-sans text-foreground text-sm whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}