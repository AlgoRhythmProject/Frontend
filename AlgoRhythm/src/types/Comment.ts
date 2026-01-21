export interface Comment {
    id: string;
    taskItemId: string;
    authorId: string;
    authorName?: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    isEdited?: boolean;
}