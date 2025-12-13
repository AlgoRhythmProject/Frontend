export interface Course {
    id: string;
    name: string;
    description: string;
    isPublished: boolean;
    createdAt: string;
    lectures: {
        id: string;
        title: string;
        tagIds: string[];
    }[];
    tasks: {
        id: string;
        title: string;
        tagIds: string[];
    }[];
}