import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lessonsData from "./Data.json";

interface Lesson {
  id: string;
  title: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    // Load lessons from Data.json
    const loadedLessons: Lesson[] = lessonsData.lessons.map((l) => ({
      id: l.id,
      title: l.title,
    }));
    setLessons(loadedLessons);

    // Load completed lessons from localStorage
    const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    setCompletedLessons(completed);
  }, []);

  const handleLessonClick = (_lessonId: string, index: number) => {
    // Unlock only next lesson
    const lastCompletedIndex = lessons.findIndex(
      (l) => l.id === completedLessons[completedLessons.length - 1]
    );
    if (index > lastCompletedIndex + 1) return; // Locked

    navigate(`/lesson/${index + 1}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Intro Section */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Quiz Platform
        </h1>
        <p className="text-gray-600 text-lg">
          Start learning step by step. Complete each lesson and unlock the next one. Track your progress and improve your skills!
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const lastCompletedIndex = lessons.findIndex(
            (l) => l.id === completedLessons[completedLessons.length - 1]
          );
          const isLocked = index > lastCompletedIndex + 1;

          return (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id, index)}
              className={`
                cursor-pointer w-full p-5 rounded-xl flex flex-col items-center justify-center shadow-lg transition-transform
                ${isCompleted ? "bg-green-500 text-white" : isLocked ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:scale-105 hover:shadow-2xl"}
              `}
            >
              <h3 className="text-lg font-semibold text-center">{lesson.title}</h3>
              {isCompleted && <span className="mt-2 text-sm">✔ Completed</span>}
              {isLocked && <span className="mt-2 text-sm">🔒 Locked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

