import type { Difficulty } from "@/utils/difficulty";
import type { taskType } from "@/utils/taskType";

export interface Task {
    taskType: taskType;
    isPublished: any;
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    category: string;
    tags: string[];
    completed: boolean;
    templateCode: string;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    constraints: string[];
    courses: TaskCourse[];
}

export interface TaskCourse {
    id: string;
    name: string;
}