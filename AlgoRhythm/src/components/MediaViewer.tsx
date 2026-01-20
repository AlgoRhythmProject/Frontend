// src/components/MediaViewer.tsx
import { useState, useEffect } from 'react';
import { fileApi } from '@/api/fileApi';

interface MediaViewerProps {
    fileName: string;
    alt?: string;
    title?: string;
    className?: string;
}

export function ImageViewer({ fileName, alt, title, className = '' }: MediaViewerProps) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const url = fileApi.getFileUrl(fileName);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Image not found');
                }
                return response.blob();
            })
            .then(blob => {
                const objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [fileName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg animate-pulse my-8">
                <div className="text-muted-foreground">Loading image...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-error/10 border border-error/30 rounded-lg p-4 my-8">
                <div className="text-error font-semibold">Error loading image</div>
                <div className="text-error/80 text-sm mt-1">{error}</div>
                <div className="text-muted-foreground text-xs mt-2 font-mono">{fileName}</div>
            </div>
        );
    }

    return (
        <figure className={`my-8 ${className}`}>
            <img
                src={imageUrl}
                alt={alt || fileName}
                className="rounded-xl mx-auto max-w-full shadow-lg"
                onError={() => setError('Failed to load image')}
            />
            {title && (
                <figcaption className="text-center text-muted-foreground mt-3 text-sm">
                    {title}
                </figcaption>
            )}
        </figure>
    );
}

export function VideoViewer({ fileName, title, className = '' }: MediaViewerProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const videoUrl = fileApi.getFileUrl(fileName);

    const handleLoadedMetadata = () => {
        setLoading(false);
    };

    const handleError = () => {
        setError('Failed to load video');
        setLoading(false);
    };

    return (
        <figure className={`my-8 ${className}`}>
            {loading && (
                <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg animate-pulse mb-4">
                    <div className="text-muted-foreground">Loading video...</div>
                </div>
            )}
            {error && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-4 mb-4">
                    <div className="text-error font-semibold">Error loading video</div>
                    <div className="text-error/80 text-sm mt-1">{error}</div>
                    <div className="text-muted-foreground text-xs mt-2 font-mono">{fileName}</div>
                </div>
            )}
            <video
                controls
                preload="metadata"
                className="rounded-xl mx-auto max-w-full shadow-lg"
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleError}
                style={{ display: loading ? 'none' : 'block' }}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {title && !error && (
                <figcaption className="text-center text-muted-foreground mt-3 text-sm">
                    {title}
                </figcaption>
            )}
        </figure>
    );
}