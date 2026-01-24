export interface CourseProgress {
    id: string;
    userId: string;
    courseId: string;
    courseName: string;
    percentage: number;
    startedAt?: string | null;
    completedAt?: string | null;
    totalLectures: number;
    completedLecturesCount: number;
    completedLectureIds: string[];
    totalTasks: number;
    completedTasksCount: number;
    completedTaskIds: string[];
}