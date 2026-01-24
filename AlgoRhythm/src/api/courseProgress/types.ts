
export interface LectureCompletionResponse {
    message: string;
    isCompleted?: boolean;
    lectureId: string;
}

export interface LectureCompletionDto {
    lectureId: string;
    isCompleted: boolean;
}

export interface UserCompletedLecturesDto {
    completedLectureIds: string[];
}

export interface UserCompletedTasksDto {
    completedTaskIds: string[];
}
