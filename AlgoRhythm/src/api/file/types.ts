
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

export interface BlobFileInfo {
    fileName: string;
    originalFileName: string;
    contentType: string;
    sizeInBytes: number;
    lastModified: string;
    url: string;
}

export interface FileListResponse {
    files: BlobFileInfo[];
    continuationToken: string | null;
    hasMore: boolean;
}