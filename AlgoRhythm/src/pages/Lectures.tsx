import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import type { Lecture } from "../types/Lecture";
import { LectureView } from "../components/Lectures/LectureView";
import LectureList from "@/components/Lectures/LectureList";
import { LoadingState } from "@/components/LoadingState";
import { lectureApi } from "@/api/lecture/lectureApi";

export function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [fullLecture, setFullLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLecture, setIsLoadingLecture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fromCourse = location.state?.fromCourse;
  const courseId = location.state?.courseId;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await lectureApi.getPublished();
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

    const fetchFullLecture = async (id: string) => {
      try {
        setIsLoadingLecture(true);
        const data = await lectureApi.getById(id);
        setFullLecture(data);
        setSelectedLecture(id);
      } catch (err: any) {
        console.error('Failed to load lecture:', err);
        setError(err.response?.data?.message || 'Failed to load lecture.');
        setSelectedLecture(null);
        setFullLecture(null);
      } finally {
        setIsLoadingLecture(false);
      }
    };

    if (lectureId) {
      fetchFullLecture(lectureId);
    } else {
      setSelectedLecture(null);
      setFullLecture(null);
    }
  }, [searchParams]);

  const handleBack = () => {
    if (fromCourse && courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      setSelectedLecture(null);
      setFullLecture(null);
      setSearchParams({});
    }
  };

  const handleProgressUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <LoadingState
        isLoading={true}
        loadingText="Loading lectures..." error={null} children={undefined} />
    );
  }

  if (error && !selectedLecture) {
    return (
      <LoadingState
        error={error}
        onRetry={() => setRefreshKey(prev => prev + 1)} isLoading={false} children={undefined} />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {isLoadingLecture ? (
          <LoadingState
            isLoading={true}
            loadingText="Loading lecture..." error={null} children={undefined} />
        ) : fullLecture ? (
          <LectureView
            lecture={fullLecture}
            courseId={courseId}
            onBack={handleBack}
            onProgressUpdate={handleProgressUpdate}
          />
        ) : (
          <LectureList
            lectures={lectures}
            onSelectLecture={(id) => {
              setSearchParams({ id });
            }}
          />
        )}
      </div>
    </div>
  );
}