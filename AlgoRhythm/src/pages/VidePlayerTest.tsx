import { useEffect, useState } from "react";

export interface VideoMetadata {
    fileName: string;
    streamUrl: string;
    fileSize: number;
    lastModified: string;
}

interface VideoPlayerProps {
    fileName: string;
}

function VideoPlayer({ fileName }: Readonly<VideoPlayerProps>) {
    const [videoInfo, setVideoInfo] = useState<VideoMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`http://localhost:7062/api/File/video_info?fileName=${encodeURIComponent(fileName)}`)
            .then(r => {
                if (!r.ok) throw new Error('Video not found');
                return r.json();
            })
            .then((data: VideoMetadata) => {
                setVideoInfo(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, [fileName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading video...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                <div className="text-red-800 font-semibold">Error</div>
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    if (!videoInfo) {
        return (
            <div className="text-gray-500 p-4">No video information available</div>
        );
    }

    const videoStreamUrl = `http://localhost:7062/api/File/get_file?fileName=${encodeURIComponent(fileName)}`;

    return (
        <div className="video-container max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{videoInfo.fileName}</h2>
            <video
                className="w-full rounded-lg shadow-lg"
                style={{ maxWidth: '800px' }}
                controls
                preload="metadata"
            >
                <source src={videoStreamUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="video-info mt-4 space-y-2">
                <p className="text-gray-700">
                    <span className="font-semibold">Size:</span>{' '}
                    {(videoInfo.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Modified:</span>{' '}
                    {new Date(videoInfo.lastModified).toLocaleString()}
                </p>
            </div>
        </div>
    );
}

export default VideoPlayer;