import type { Tag } from "./Tag";

export interface LectureContent {
    id: string;
    lectureId: string;
    type: "Photo" | "Text" | "Video";
    order: number;
    createdAt: string;

    // For Text content
    htmlContent?: string;

    // For Photo content
    path?: string;
    alt?: string;
    title?: string;

    // For Video content
    fileName?: string;
    streamUrl?: string;
    fileSize?: number;
    lastModified?: string;
}

export interface Lecture {
    id: string;
    courseIds: string[];
    title: string;
    isPublished: boolean;
    createdAt: string;
    contents: LectureContent[];
    tagIds: string[];
    tags?: Tag[];
}