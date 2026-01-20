export interface LectureContent {
    id: string;
    lectureId: string;
    type: "Photo" | "Text" | "Video";
    order: number;
    createdAt: string;
    htmlContent?: string;
    path?: string;
    alt?: string;
    title?: string;
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

export interface Tag {
    id: string;
    name: string;
}

export interface LectureInputDto {
    title: string;
    isPublished: boolean;
}

export interface LectureContentInputDto {
    type: string;
    htmlContent?: string;
    path?: string
    alt?: string;
    title?: string;
}

export interface ChangeContentOrderDto {
    firstContentId: string;
    secondContentId: string;
}