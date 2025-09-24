import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // 🎉 install this: npm install react-confetti
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
 content?: string; 
  quiz: Question[];
}

// ✅ Mark lesson complete in localStorage
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
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const foundLesson = lessonsData.lessons.find(
      (l) => l.id === `lesson${lessonNumber}`
    );
    if (foundLesson) setLesson(foundLesson);
    setLoading(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAnswers({});
    setShowConfetti(false);
  }, [lessonNumber]);

  if (loading) return <p className="text-center mt-10">Loading Lesson...</p>;
  if (!lesson) return <p className="text-center mt-10 text-red-500">Lesson not found</p>;

  const question = lesson.quiz[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (!submitted) setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setAnswers({ ...answers, [currentQuestionIndex]: selectedOption });
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
      setSubmitted(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
      setSubmitted(true);
    }
  };

  const isQuizComplete = Object.keys(answers).length === lesson.quiz.length;
  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.correct).length;
  const wrongCount = lesson.quiz.length - correctCount;

  // ✅ Result Page
  if (isQuizComplete && currentQuestionIndex === lesson.quiz.length - 1) {
    markLessonComplete(lesson.id);
    setTimeout(() => setShowConfetti(true), 500);

    return (
      <div className="relative">
        {showConfetti && <Confetti />}
        <div className="max-w-3xl mx-auto my-12 px-6 text-center bg-gradient-to-r from-blue-500 to-indigo-600 shadow-2xl rounded-3xl p-12 text-white">
          <h1 className="text-4xl font-extrabold mb-6">{lesson.title} - Result 🎉</h1>
          <p className="text-lg mb-2">✅ Correct: {correctCount}</p>
          <p className="text-lg mb-2">❌ Wrong: {wrongCount}</p>
          <p className="text-2xl mt-6 font-bold">
            Score: {Math.round((correctCount / lesson.quiz.length) * 100)}%
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 py-3 px-8 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Quiz Page
  return (
    <div className="max-w-3xl mx-auto my-12 px-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900">{lesson.title}</h1>
      <p className="text-gray-600 text-lg mb-10 text-center">{lesson.content}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 relative">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all"
          style={{
            width: `${((currentQuestionIndex + 1) / lesson.quiz.length) * 100}%`,
          }}
        />
        <span className="absolute top-[-28px] right-0 text-sm font-semibold text-gray-700">
          {Math.round(((currentQuestionIndex + 1) / lesson.quiz.length) * 100)}%
        </span>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Question {currentQuestionIndex + 1} of {lesson.quiz.length}
        </h2>
        <p className="text-lg mb-6 text-gray-700">{question.question}</p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`py-4 px-6 rounded-2xl border text-left font-medium shadow-sm transition-all
                ${
                  submitted
                    ? opt === question.correct
                      ? "bg-green-500 text-white border-green-500 shadow-lg"
                      : opt === selectedOption
                      ? "bg-red-500 text-white border-red-500 shadow-lg"
                      : "bg-gray-100 border-gray-300"
                    : selectedOption === opt
                    ? "bg-blue-100 border-blue-400 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:shadow-md"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-2 px-6 rounded-lg font-semibold transition-colors shadow-md ${
              currentQuestionIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="py-2 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 shadow-md transition-transform hover:scale-105"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="py-2 px-6 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 shadow-md transition-transform hover:scale-105"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
