import { useState, useEffect } from 'react';

export interface ImageViewerProps {
    fileName: string;
    alt?: string;
    className?: string;
}

function ImageViewer({ fileName, alt, className = '' }: Readonly<ImageViewerProps>) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const url = `http://localhost:7062/api/File/get_file?fileName=${encodeURIComponent(fileName)}`;

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
            <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Loading image...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800 font-semibold">Error</div>
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className={`image-viewer ${className}`}>
            <img
                src={imageUrl}
                alt={alt || fileName}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={() => setError('Failed to load image')}
            />
        </div>
    );
}

export default ImageViewer;