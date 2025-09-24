import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lessonsData from "./Data.json";
import { CheckCircle, Lock, BookOpen } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");

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

    // Live date & time update
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(now.toLocaleString()); // Date + Time
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLessonClick = (_lessonId: string, index: number) => {
    const lastCompletedIndex = lessons.findIndex(
      (l) => l.id === completedLessons[completedLessons.length - 1]
    );
    if (index > lastCompletedIndex + 1) return; // Locked

    navigate(`/lesson/${index + 1}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Intro Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm mb-2">
          Welcome to <span className="text-blue-600">MicroQuiz</span>
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          Learn step by step. Each lesson you complete unlocks the next one. 
          Stay consistent and track your progress!
        </p>

        {/* Live Date & Time */}
        <div className="text-md font-medium text-gray-700 bg-white shadow px-4 py-2 rounded-lg inline-block">
          {dateTime}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const lastCompletedIndex = lessons.findIndex(
            (l) => l.id === completedLessons[completedLessons.length - 1]
          );
          const isLocked = index > lastCompletedIndex + 1;

          return (
            <div
              key={lesson.id}
              onClick={() => !isLocked && handleLessonClick(lesson.id, index)}
              className={`
                relative group cursor-pointer w-full p-6 rounded-2xl flex flex-col items-center justify-center shadow-md transition-transform duration-300
                ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : isLocked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:scale-105 hover:shadow-2xl"
                }
              `}
            >
              <div className="mb-3">
                {isCompleted ? (
                  <CheckCircle size={28} className="text-white drop-shadow" />
                ) : isLocked ? (
                  <Lock size={28} className="text-gray-500" />
                ) : (
                  <BookOpen size={28} className="text-blue-600 group-hover:scale-110 transition" />
                )}
              </div>
              <h3
                className={`text-lg font-semibold text-center ${
                  isCompleted ? "text-white" : isLocked ? "text-gray-500" : "text-gray-800"
                }`}
              >
                {lesson.title}
              </h3>

              {/* Status Text */}
              <span className="mt-2 text-sm font-medium">
                {isCompleted && "✔ Completed"}
                {isLocked && "🔒 Locked"}
                {!isCompleted && !isLocked && "Available"}
              </span>

              {/* Decorative Progress Glow */}
              {!isLocked && !isCompleted && (
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
