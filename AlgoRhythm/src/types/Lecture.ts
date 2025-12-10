// types/Lecture.ts

export interface LectureContent {
    id: string;
    lectureId: string;
    type: "Text" | "Photo" | "Video" | "File";
    order: number;
    createdAt: string;
    htmlContent: string | null;
    path: string | null;
    alt: string | null;
    title: string | null;
}

export interface Lecture {
    id: string;
    courseId: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
    contents: LectureContent[];
    tagIds: string[];
}

