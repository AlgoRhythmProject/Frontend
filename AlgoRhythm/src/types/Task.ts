import type { Difficulty } from "@/utils/difficulty";
import type { taskType } from "@/utils/taskType";
import type { Hint } from "./Hint";
import type { Tag } from "./Tag";

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

    tagIds?: string[];
    hintIds?: string[];

    tags?: Tag[];
    hints?: Hint[];
    courses?: TaskCourse[];
}

export interface TaskCourse {
    id: string;
    name: string;
}

export interface TaskWithCourses extends Task {
    courseIds: string[];
}