import type {
    Lecture,
    LectureInputDto,
    LectureContent,
    LectureContentInputDto,
    ChangeContentOrderDto
} from "@/types/Lecture";
import apiClient from "./apiClient";

export const lectureApi = {
    // Lecture endpoints
    getAll: async (): Promise<Lecture[]> => {
        const res = await apiClient.get<Lecture[]>("/Lecture");
        return res.data;
    },
    getPublished: async (): Promise<Lecture[]> => {
        const res = await apiClient.get<Lecture[]>("/Lecture/published");
        return res.data;
    },
    getByCourseId: async (courseId: string): Promise<Lecture[]> => {
        const res = await apiClient.get<Lecture[]>(`/Lecture/course/${courseId}`);
        return res.data;
    },
    getById: async (id: string): Promise<Lecture> => {
        const res = await apiClient.get<Lecture>(`/Lecture/${id}`);
        return res.data;
    },
    create: async (dto: LectureInputDto): Promise<Lecture> => {
        const res = await apiClient.post<Lecture>("/Lecture", dto);
        return res.data;
    },
    update: async (id: string, dto: LectureInputDto): Promise<void> => {
        await apiClient.put(`/Lecture/${id}`, dto);
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/Lecture/${id}`);
    },
    // Tag management
    addTag: async (lectureId: string, tagId: string): Promise<void> => {
        await apiClient.post(`/Lecture/${lectureId}/tags/${tagId}`);
    },
    removeTag: async (lectureId: string, tagId: string): Promise<void> => {
        await apiClient.delete(`/Lecture/${lectureId}/tags/${tagId}`);
    },
    // Content management
    getAllContents: async (lectureId: string): Promise<LectureContent[]> => {
        const res = await apiClient.get<LectureContent[]>(`/Lecture/${lectureId}/contents`);
        return res.data;
    },
    addContent: async (lectureId: string, dto: LectureContentInputDto): Promise<LectureContent> => {
        const res = await apiClient.post<LectureContent>(`/Lecture/${lectureId}/contents`, dto);
        return res.data;
    },
    getContentById: async (lectureId: string, contentId: string): Promise<LectureContent> => {
        const res = await apiClient.get<LectureContent>(`/Lecture/${lectureId}/contents/${contentId}`);
        return res.data;
    },
    updateContent: async (lectureId: string, contentId: string, dto: LectureContentInputDto): Promise<void> => {
        await apiClient.put(`/Lecture/${lectureId}/contents/${contentId}`, dto);
    },
    removeContent: async (lectureId: string, contentId: string): Promise<void> => {
        await apiClient.delete(`/Lecture/${lectureId}/contents/${contentId}`);
    },
    swapContentOrder: async (lectureId: string, dto: ChangeContentOrderDto): Promise<void> => {
        await apiClient.patch(`/Lecture/${lectureId}/contents/swap-order`, dto);
    }

};