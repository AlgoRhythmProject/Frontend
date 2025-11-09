import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { lectures } from "../data/mockData";
import { LectureList } from "../components/LectureList";
import { LectureView } from "../components/LectureView";

export function Lectures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);

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
