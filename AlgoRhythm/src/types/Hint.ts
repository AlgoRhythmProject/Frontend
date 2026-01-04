export interface Hint {
    id: string;
    taskId: string;
    title: string;
    content: string;
    order: number;
    costInPoints?: number;
    createdAt: string;
    updatedAt?: string;
}
