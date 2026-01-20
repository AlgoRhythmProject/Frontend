import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { fileApi } from '@/api/fileApi';

interface FileUploadProps {
    accept: 'image/*' | 'video/*';
    onUploadSuccess: (fileName: string) => void;
    currentFile?: string;
    label?: string;
}

export function FileUpload({ accept, onUploadSuccess, currentFile, label }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(currentFile || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isImage = accept === 'image/*';
    const isVideo = accept === 'video/*';

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File too large. Max size: ${isVideo ? '100MB' : '10MB'}`);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setError(null);

        setUploading(true);
        try {
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

            const result = await fileApi.upload(file);

            console.log('Upload result:', result);


            let fileName = file.name;

            if (result.url) {
                try {
                    const url = new URL(result.url);
                    const fileNameParam = url.searchParams.get('fileName');
                    if (fileNameParam) {
                        fileName = fileNameParam;
                    } else {
                        const pathParts = url.pathname.split('/');
                        fileName = pathParts[pathParts.length - 1] || file.name;
                    }
                } catch {
                    fileName = file.name;
                }
            }

            console.log('Extracted fileName:', fileName);

            setUploadedFileName(fileName);
            onUploadSuccess(fileName);
        } catch (err) {
            console.error('Upload failed:', err);
            console.error('Error details:', {
                name: err instanceof Error ? err.name : 'Unknown',
                message: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined
            });
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadedFileName(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block font-sans font-medium text-foreground">
                    {label}
                </label>
            )}

            {/* Upload Button / Preview */}
            {!preview && !uploadedFileName ? (
                <div
                    onClick={handleClick}
                    className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            {isImage ? (
                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                            ) : (
                                <VideoIcon className="w-12 h-12 text-muted-foreground" />
                            )}
                            <div>
                                <p className="font-sans font-medium text-foreground">
                                    Click to upload {isImage ? 'image' : 'video'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isImage ? 'PNG, JPG, GIF up to 10MB' : 'MP4, WebM up to 100MB'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative border border-muted rounded-lg p-4 bg-card">
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-background hover:bg-muted rounded-full transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Preview */}
                    <div className="flex items-center gap-4">
                        {isImage && preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        )}
                        {isVideo && preview && (
                            <video
                                src={preview}
                                className="w-48 h-32 object-cover rounded-lg"
                                controls
                            />
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Upload className="w-4 h-4 text-success" />
                                <span className="text-sm font-medium text-foreground">
                                    {uploading ? 'Uploading...' : 'Uploaded successfully'}
                                </span>
                            </div>
                            {uploadedFileName && (
                                <p className="text-sm text-muted-foreground font-mono">
                                    {uploadedFileName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-3">
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}
        </div>
    );
}