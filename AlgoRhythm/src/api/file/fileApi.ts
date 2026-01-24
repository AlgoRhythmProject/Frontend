import apiClient from "../apiClient";
import type { VideoInfo, FileUploadResponse, FileListResponse } from "./types";

export const fileApi = {
    getFileUrl: (fileName: string): string => {
        return `${apiClient.defaults.baseURL}/File/get_file?fileName=${encodeURIComponent(fileName)}`;
    },

    getFile: async (fileName: string): Promise<Blob> => {
        const res = await apiClient.get('/File/get_file', {
            params: { fileName },
            responseType: 'blob'
        });
        return res.data;
    },

    getVideoInfo: async (fileName: string): Promise<VideoInfo> => {
        const res = await apiClient.get<VideoInfo>('/File/video_info', {
            params: { fileName }
        });
        return res.data;
    },

    upload: async (file: File): Promise<FileUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post<FileUploadResponse>('/File', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },

    delete: async (fileName: string): Promise<boolean> => {
        const res = await apiClient.delete<boolean>(`/File/${encodeURIComponent(fileName)}`);
        return res.data;
    },

    list: async (pageSize: number = 3, continuationToken?: string): Promise<FileListResponse> => {
        const res = await apiClient.get<FileListResponse>('/File/list', {
            params: {
                pageSize,
                ...(continuationToken && { continuationToken })
            }
        });
        return res.data;
    },
};