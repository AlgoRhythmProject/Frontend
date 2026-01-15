import type { Tag } from "@/api/tagApi";
import type { Difficulty } from "@/utils/difficulty";
import type { taskType } from "@/utils/taskType";
import type { Hint } from "./Hint";


export interface Task {
    id: string;
    title: string;
    description?: string;
    difficulty: Difficulty;
    taskType: taskType;
    isPublished: boolean;
    isDeleted: boolean;
    createdAt: string;

    // Programming task fields
    templateCode?: string;

    // Interactive task fields
    optionsJson?: string;
    correctAnswer?: string;

    // Relations (IDs)
    tagIds?: string[];
    hintIds?: string[];

    // For display purposes (if needed)
    tags?: Tag[];
    hints?: Hint[];
    courses?: TaskCourse[];

    // Legacy/UI fields (keep for backward compatibility if needed)
    category?: string;
    completed?: boolean;
    examples?: {
        input: string;
        output: string;
        explanation?: string;
    }[];
}

export interface TaskCourse {
    id: string;
    name: string;
}

export interface TaskWithCourses extends Task {
    courseIds: string[];
}

// DTO for creating/updating tasks
export interface TaskInputDto {
    title: string;
    description?: string;
    difficulty: Difficulty;
    taskType: taskType;
    isPublished: boolean;
    templateCode?: string;
    optionsJson?: string;
    correctAnswer?: string;
    tagIds?: string[];
    hintIds?: string[];
}

// Detailed task response (from GetById endpoint)
export interface TaskDetailsDto extends Task {
    testCases?: TestCase[];
}

export interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}