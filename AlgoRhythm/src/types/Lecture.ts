export interface LectureContent {
    id: string;
    lectureId: string;
    type: "Photo" | "Text" | "Video";
    order: number;
    createdAt: string;

    // Text content
    htmlContent?: string;

    // Photo content
    path?: string;
    alt?: string;
    title?: string;

    // Video content
    fileName?: string;
    streamUrl?: string;
    fileSize?: number;
    lastModified?: string;
}

export interface Lecture {
    id: string;
    courseId: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
    contents: LectureContent[];
    tagIds: string[];
    tags?: Tag[];
}

export interface Tag {
    id: string;
    name: string;
}

export interface LectureInputDto {
    courseId: string;
    title: string;
    isPublished: boolean;
}

export interface LectureContentInputDto {
    type: string; // "Text", "Photo", or "Video"
    htmlContent?: string;
    path?: string;
    alt?: string;
    title?: string;
    fileName?: string;
    streamUrl?: string;
}

export interface ChangeContentOrderDto {
    firstContentId: string;
    secondContentId: string;
}