import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { lectureApi } from "../api/lectureApi";
import type { Lecture } from "../types/Lecture";
import { LectureView } from "../components/Lectures/LectureView";
import LectureList from "@/components/Lectures/LectureList";

export function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    lectureApi.getAll().then(setLectures);
  }, []);

  useEffect(() => {
    const lectureId = searchParams.get("id");
    if (lectureId) setSelectedLecture(lectureId);
  }, [searchParams]);

  const activeLecture = selectedLecture
    ? lectures.find((l) => l.id === selectedLecture)
    : null;

  return (
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
  );
}
