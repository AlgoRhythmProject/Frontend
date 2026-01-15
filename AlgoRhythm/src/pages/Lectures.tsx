import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { lectureApi } from "../api/lectureApi";
import type { Lecture } from "../types/Lecture";
import { LectureView } from "../components/Lectures/LectureView";
import LectureList from "@/components/Lectures/LectureList";
import { LoadingState } from "@/components/LoadingState";

export function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fromCourse = location.state?.fromCourse;
  const courseId = location.state?.courseId;

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
  }, [refreshKey]);

  useEffect(() => {
    const lectureId = searchParams.get("id");
    if (lectureId) setSelectedLecture(lectureId);
  }, [searchParams]);

  const handleBack = () => {
    if (fromCourse && courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      setSelectedLecture(null);
      setSearchParams({});
    }
  };

  const handleProgressUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const activeLecture = selectedLecture
    ? lectures.find((l) => l.id === selectedLecture)
    : null;

  return (
    <LoadingState
      isLoading={isLoading}
      error={error}
      loadingText="Loading lectures..."
      onRetry={() => setRefreshKey(prev => prev + 1)}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeLecture ? (
            <LectureView
              lecture={activeLecture}
              courseId={courseId}
              onBack={handleBack}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : (
            <LectureList
              lectures={lectures}
              onSelectLecture={(id) => {
                setSelectedLecture(id);
                setSearchParams({ id });
              }}
            />
          )}
        </div>
      </div>
    </LoadingState>
  );
}