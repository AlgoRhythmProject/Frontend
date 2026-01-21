export interface CourseListItem {
    id: string;
    name: string;
}

export interface CourseInputDto {
    name: string;
    description?: string;
    isPublished: boolean;
}
