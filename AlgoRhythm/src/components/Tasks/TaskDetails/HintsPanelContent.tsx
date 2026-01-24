
import { useEffect, useState as useHintState } from "react";
import { Lock, ChevronRight, ChevronDown as ChevronDownIcon, Loader2 } from "lucide-react";
import type { Hint } from "@/types/Hint";
import { hintApi } from "@/api/hint/hintApi";

export function HintsPanelContent({ taskId }: Readonly<{ taskId: string }>) {
    const [hints, setHints] = useHintState<Hint[]>([]);
    const [loading, setLoading] = useHintState(true);
    const [error, setError] = useHintState<string | null>(null);
    const [unlockedHints, setUnlockedHints] = useHintState<Set<string>>(new Set());
    const [expandedHints, setExpandedHints] = useHintState<Set<string>>(new Set());

    useEffect(() => {
        const fetchHints = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await hintApi.getByTaskId(taskId);
                setHints([...data].sort((a, b) => a.order - b.order));
            } catch (err: any) {
                console.error("Failed to fetch hints:", err);
                setError(err.response?.data?.error || "Failed to load hints");
            } finally {
                setLoading(false);
            }
        };

        fetchHints();
    }, [taskId]);

    const toggleExpand = (hintId: string) => {
        setExpandedHints((prev) => {
            const next = new Set(prev);
            if (next.has(hintId)) {
                next.delete(hintId);
            } else {
                next.add(hintId);
            }
            return next;
        });
    };

    const unlockHint = (hintId: string) => {
        setUnlockedHints((prev) => new Set(prev).add(hintId));
        setExpandedHints((prev) => new Set(prev).add(hintId));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return <p className="text-error text-sm">{error}</p>;
    }

    if (hints.length === 0) {
        return (
            <p className="text-muted-foreground text-sm text-center py-4">
                No hints available for this task.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {hints.map((hint) => {
                const isUnlocked = unlockedHints.has(hint.id);
                const isExpanded = expandedHints.has(hint.id);

                return (
                    <div
                        key={hint.id}
                        className="bg-background border border-muted rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => {
                                if (isUnlocked) {
                                    toggleExpand(hint.id);
                                } else {
                                    unlockHint(hint.id);
                                }
                            }}
                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-card-hover transition-colors cursor-pointer text-left"
                        >
                            {isUnlocked ? (
                                isExpanded ? (
                                    <ChevronDownIcon className="w-4 h-4 text-foreground shrink-0" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-foreground shrink-0" />
                                )
                            ) : (
                                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}

                            {!isUnlocked && (
                                <span className="text-primary text-xs font-sans font-medium">
                                    Unlock
                                </span>
                            )}
                        </button>

                        {isUnlocked && isExpanded && (
                            <div className="px-3 py-2 bg-card-hover border-t border-muted">
                                <p className="font-sans text-foreground text-sm whitespace-pre-wrap">
                                    {hint.content}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}