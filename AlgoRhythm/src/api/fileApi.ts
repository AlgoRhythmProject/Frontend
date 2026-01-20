// src/api/fileApi.ts
import apiClient from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7062';

export interface VideoInfo {
    duration: number;
    width: number;
    height: number;
    size: number;
    contentType: string;
}

export interface FileUploadResponse {
    url: string;
    message: string;
}

export const fileApi = {
    /**
     * Zwraca pełny URL do pliku (dla <img src> i <video src>)
     * Endpoint publiczny - nie wymaga autoryzacji
     */
    getFileUrl: (fileName: string): string => {
        return `${API_BASE_URL}/api/File/get_file?fileName=${encodeURIComponent(fileName)}`;
    },

    /**
     * Pobiera plik jako Blob
     * Endpoint publiczny - nie wymaga autoryzacji
     */
    getFile: async (fileName: string): Promise<Blob> => {
        const res = await apiClient.get(`/File/get_file`, {
            params: { fileName },
            responseType: 'blob'
        });
        return res.data;
    },

    /**
     * Pobiera informacje o wideo
     * Endpoint publiczny - nie wymaga autoryzacji
     */
    getVideoInfo: async (fileName: string): Promise<VideoInfo> => {
        const res = await apiClient.get<VideoInfo>(`/File/video_info`, {
            params: { fileName }
        });
        return res.data;
    },

    /**
     * Upload pliku (tylko Admin)
     * Endpoint wymaga autoryzacji: [Authorize(Roles = "Admin")]
     */
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

    /**
     * Usuwa plik (tylko Admin)
     * Endpoint wymaga autoryzacji: [Authorize(Roles = "Admin")]
     */
    delete: async (fileName: string): Promise<boolean> => {
        const res = await apiClient.delete<boolean>(`/File/${encodeURIComponent(fileName)}`);
        return res.data;
    }
};