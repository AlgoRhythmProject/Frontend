export interface LectureInputDto {
    title: string;
    isPublished: boolean;
}

export interface LectureContentInputDto {
    type: string;
    order?: number;

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

export interface ChangeContentOrderDto {
    firstContentId: string;
    secondContentId: string;
}