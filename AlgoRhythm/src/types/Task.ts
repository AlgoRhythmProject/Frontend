export interface Task {
    taskType: "Programming" | "Interactive";
    isPublished: any;
    id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    tags: string[];
    completed: boolean;
    starterCode: string;
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