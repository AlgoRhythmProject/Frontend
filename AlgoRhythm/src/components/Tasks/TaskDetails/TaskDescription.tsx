import { useState } from "react";
import { MessageSquare, Code } from "lucide-react";
import { CommentsSection } from "./CommentSection";
import { TaskSubmissionsTab } from "./TaskSubmissionsTab";
import type { Task } from "@/types/Task";

interface TaskDescriptionProps {
    task: Task;
}

type TabType = "description" | "discussion" | "submissions";

export function TaskDescription({ task }: TaskDescriptionProps) {
    const [activeTab, setActiveTab] = useState<TabType>("description");

    return (
        <div className="w-full lg:w-1/2 overflow-hidden bg-background flex flex-col">
            {/* Tabs Header */}
            <div className="border-b border-muted flex">
                <button
                    onClick={() => setActiveTab("description")}
                    className={`flex-1 px-6 py-3 font-sans cursor-pointer font-medium transition-colors relative ${activeTab === "description"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Description
                    {activeTab === "description" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("discussion")}
                    className={`flex-1 px-6 py-3 font-sans cursor-pointer font-medium transition-colors relative flex items-center justify-center gap-2 ${activeTab === "discussion"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Discussion
                    {activeTab === "discussion" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("submissions")}
                    className={`flex-1 px-6 py-3 font-sans cursor-pointer font-medium transition-colors relative flex items-center justify-center gap-2 ${activeTab === "submissions"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Code className="w-4 h-4" />
                    Submissions
                    {activeTab === "submissions" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "description" ? (
                    <div className="max-w-2xl">
                        <h2 className="font-sans font-medium text-foreground text-2xl mb-4">
                            Description
                        </h2>
                        <p className="font-sans text-foreground mb-6 whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>
                ) : activeTab === "discussion" ? (
                    <div className="max-w-2xl">
                        <CommentsSection taskId={task.id} />
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <TaskSubmissionsTab taskId={task.id} />
                    </div>
                )}
            </div>
        </div>
    );
}