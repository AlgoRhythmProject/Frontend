import { useState, useEffect } from 'react';
import { Check, Upload, RefreshCw, Video as VideoIcon } from 'lucide-react';
import { fileApi } from '@/api/file/fileApi';
import type { BlobFileInfo } from '@/api/file/types';

interface FileSelectorProps {
    accept: string; // 'image/*' | 'video/*'
    onSelect: (fileName: string) => void;
    currentFile?: string;
    label?: string;
}

export function FileSelector({ accept, onSelect, currentFile, label }: FileSelectorProps) {
    const [mode, setMode] = useState<'upload' | 'select'>('select');
    const [existingFiles, setExistingFiles] = useState<BlobFileInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | undefined>(currentFile);

    const fileType = accept.includes('image') ? 'image' : accept.includes('video') ? 'video' : 'file';

    useEffect(() => {
        if (mode === 'select') {
            loadExistingFiles();
        }
    }, [mode]);

    useEffect(() => {
        setSelectedFile(currentFile);
    }, [currentFile]);

    const loadExistingFiles = async () => {
        setLoading(true);
        try {
            const response = await fileApi.list(100);
            const filtered = response.files.filter(file => {
                if (accept.includes('image')) {
                    return file.contentType.startsWith('image/');
                }
                if (accept.includes('video')) {
                    return file.contentType.startsWith('video/');
                }
                return true;
            });
            setExistingFiles(filtered);
        } catch (error) {
            console.error('Failed to load files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await fileApi.upload(file);
            const fileName = response.url.split('/').pop() || response.url;
            setSelectedFile(fileName);
            onSelect(fileName);
            alert('File uploaded successfully!');
            // Switch to select mode and refresh list
            setMode('select');
            loadExistingFiles();
        } catch (error: any) {
            console.error('Upload failed:', error);
            if (error.response?.status === 409) {
                alert('This file already exists! Switch to "Select Existing" to choose it.');
                setMode('select');
                loadExistingFiles();
            } else {
                alert('Failed to upload file');
            }
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleSelectFile = (fileName: string) => {
        setSelectedFile(fileName);
        onSelect(fileName);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block font-sans font-medium text-foreground">
                    {label || `Select ${fileType}`}
                </label>
                {mode === 'select' && (
                    <button
                        type="button"
                        onClick={loadExistingFiles}
                        disabled={loading}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setMode('select')}
                    className={`flex-1 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${mode === 'select'
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                >
                    Select Existing
                </button>
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${mode === 'upload'
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                >
                    Upload New
                </button>
            </div>

            {/* Upload Mode */}
            {mode === 'upload' && (
                <div className="bg-background border-2 border-dashed border-muted rounded-lg p-8">
                    <label className="cursor-pointer flex flex-col items-center gap-3 hover:border-primary transition-colors">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="font-sans font-medium text-foreground">
                                {uploading ? 'Uploading...' : `Click to upload ${fileType}`}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {accept === 'image/*' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, WebM up to 100MB'}
                            </p>
                        </div>
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>

                    {selectedFile && (
                        <div className="mt-4 p-3 bg-card border border-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Currently selected:</p>
                            <p className="text-sm font-mono text-foreground break-all">{selectedFile}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Select Mode */}
            {mode === 'select' && (
                <>
                    {loading ? (
                        <div className="text-center py-8 bg-background border border-muted rounded-lg">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Loading {fileType}s...</p>
                        </div>
                    ) : existingFiles.length === 0 ? (
                        <div className="text-center py-8 bg-background border border-muted rounded-lg">
                            <p className="text-foreground font-medium">No existing {fileType}s found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Upload your first {fileType} using "Upload New" button above
                            </p>
                        </div>
                    ) : (
                        <div className="bg-background border border-muted rounded-lg p-3 max-h-96 overflow-y-auto">
                            <div className={`grid gap-2 ${fileType === 'image'
                                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                                    : 'grid-cols-1'
                                }`}>
                                {existingFiles.map((file) => (
                                    <button
                                        key={file.fileName}
                                        type="button"
                                        onClick={() => handleSelectFile(file.fileName)}
                                        className={`relative p-2 border-2 rounded-lg transition-all hover:border-primary ${selectedFile === file.fileName
                                                ? 'border-primary bg-primary/10'
                                                : 'border-muted'
                                            }`}
                                    >
                                        {/* Image preview */}
                                        {file.contentType.startsWith('image/') && (
                                            <div className="aspect-square mb-2 bg-muted rounded overflow-hidden">
                                                <img
                                                    src={fileApi.getFileUrl(file.fileName)}
                                                    alt={file.originalFileName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="12"%3EError%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Video preview */}
                                        {file.contentType.startsWith('video/') && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-16 h-16 flex items-center justify-center bg-muted rounded flex-shrink-0">
                                                    <VideoIcon className="w-8 h-8 text-purple-500" />
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="font-mono text-xs text-foreground break-all line-clamp-2">
                                                        {file.originalFileName}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* File info */}
                                        <div className="text-xs text-muted-foreground text-left space-y-1">
                                            {fileType === 'image' && (
                                                <p className="font-mono break-all line-clamp-1" title={file.originalFileName}>
                                                    {file.originalFileName}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{formatFileSize(file.sizeInBytes)}</span>
                                                <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Selected indicator */}
                                        {selectedFile === file.fileName && (
                                            <div className="absolute top-1 right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}