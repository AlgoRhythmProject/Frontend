import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { lectureApi } from "../api/lectureApi";
import type { Lecture } from "../types/Lecture";
import { LectureView } from "../components/Lectures/LectureView";
import LectureList from "@/components/Lectures/LectureList";
import { LoadingState } from "@/components/LoadingState";

export function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await lectureApi.getAll();
        setLectures(data);
      } catch (err: any) {
        console.error('Failed to load lectures:', err);
        setError(err.response?.data?.message || 'Failed to load lectures. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, []);

  useEffect(() => {
    const lectureId = searchParams.get("id");
    if (lectureId) setSelectedLecture(lectureId);
  }, [searchParams]);

  const activeLecture = selectedLecture
    ? lectures.find((l) => l.id === selectedLecture)
    : null;

  return (
    <LoadingState
      isLoading={isLoading}
      error={error}
      loadingText="Loading lectures..."
      onRetry={() => window.location.reload()}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeLecture ? (
            <LectureView
              lecture={activeLecture}
              onBack={() => {
                setSelectedLecture(null);
                setSearchParams({});
              }}
            />
          ) : (
            <LectureList
              lectures={lectures}
              onSelectLecture={(id) => setSelectedLecture(id)}
            />
          )}
        </div>
      </div>
    </LoadingState>
  );
}