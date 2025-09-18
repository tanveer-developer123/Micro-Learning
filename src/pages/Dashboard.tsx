import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lessonsData from "./Data.json";

interface Lesson {
  id: string;
  title: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [today, setToday] = useState<string>("");

  // Live date update
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      setToday(formattedDate);
    };

    updateDate(); // initial
    const interval = setInterval(updateDate, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Load lessons and completed progress from localStorage
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    setCompletedLessons(completed);

    const lessonList: Lesson[] = lessonsData.lessons.map((l: any) => ({
      id: l.id,
      title: l.title,
    }));
    setLessons(lessonList);
  }, []);

  const handleLessonClick = (lessonId: string, index: number) => {
  // unlock only current lesson (previous completed, next locked)
  const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
  const prevCompleted = index === 0 || completed.includes(lessons[index - 1].id);
  const alreadyCompleted = completed.includes(lessonId);

  if (!alreadyCompleted && prevCompleted) {
    navigate(`/lesson/${index + 1}`);
  }
};


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Today’s Date */}
      <div className="mb-6 text-gray-600 text-lg font-medium text-center">
        Today: <span className="font-bold">{today}</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Lessons</h1>

      {/* Grid Layout: 4 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {lessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isLocked = idx > 0 && !completedLessons.includes(lessons[idx - 1].id);
          const isActive = idx === 0 || !isLocked;

          return (
            <div
              key={lesson.id}
              onClick={() => !isLocked && handleLessonClick(lesson.id, idx)}
              className={`
                w-full p-5 rounded-xl flex flex-col items-center justify-center
                transition-all duration-300 transform cursor-pointer shadow-lg
                ${isCompleted ? "bg-green-500 text-white" : ""}
                ${isActive && !isCompleted ? "bg-white hover:scale-105 hover:shadow-2xl" : ""}
                ${isLocked ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""}
              `}
            >
              <h3 className="font-semibold text-center text-lg">{lesson.title}</h3>
              {isLocked && <span className="mt-2 text-sm">🔒 Locked</span>}
              {isCompleted && <span className="mt-2 text-sm">Completed</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
