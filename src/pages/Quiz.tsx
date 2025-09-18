import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lessonsData from "./Data.json";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

interface LessonType {
  id: string;
  title: string;
  content: string;
  quiz: Question[];
}

// Helper: mark lesson complete in localStorage
const markLessonComplete = (lessonId: string) => {
  const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem("completedLessons", JSON.stringify(completed));
  }
};

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const lessonNumber = Number(id);
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const foundLesson = lessonsData.lessons.find(
      (l) => l.id === `lesson${lessonNumber}`
    );
    if (foundLesson) setLesson(foundLesson);
    setLoading(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
  }, [lessonNumber]);

  if (loading) return <p className="text-center mt-10">Loading Lesson...</p>;
  if (!lesson) return <p className="text-center mt-10 text-red-500">Lesson not found</p>;

  const question = lesson.quiz[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };

  const isQuizComplete = Object.keys(answers).length === lesson.quiz.length;
  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.correct).length;
  const wrongCount = lesson.quiz.length - correctCount;

  if (isQuizComplete && currentQuestionIndex === lesson.quiz.length - 1) {
  const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
  if (!completed.includes(lesson.id)) {
    completed.push(lesson.id);
    localStorage.setItem("completedLessons", JSON.stringify(completed));
  }

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">{lesson.title} - Result</h1>
      <p className="text-lg mb-2 text-green-600">Correct: {correctCount}</p>
      <p className="text-lg mb-2 text-red-600">Wrong: {wrongCount}</p>
      <p className="text-lg mt-4 font-semibold">
        Score: {Math.round((correctCount / lesson.quiz.length) * 100)}%
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}


  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">{lesson.title}</h1>
      <p className="text-gray-700 text-lg mb-8">{lesson.content}</p>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestionIndex + 1} of {lesson.quiz.length}
        </h2>
        <p className="text-lg mb-6">{question.question}</p>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`py-2 px-4 rounded-lg border text-left font-medium transition-colors
                ${
                  selectedOption === opt
                    ? opt === question.correct
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors
              ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === lesson.quiz.length - 1}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors
              ${
                currentQuestionIndex === lesson.quiz.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
