import type { Task } from "@/types/Task";
import type { TestCase } from "@/types/TestCase";
import type { Difficulty } from "@/utils/difficulty";
import type { taskType } from "@/utils/taskType";

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

export interface TaskDetailsDto extends Task {
    testCases?: TestCase[];
}
