import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

function SolveQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // New states for visited and review
  const [visited, setVisited] = useState([]);
  const [review, setReview] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`);
        if (res.data && res.data.questions) {
          setQuiz(res.data);
          setAnswers(new Array(res.data.questions.length).fill(null));
          if (res.data.timeLimit && res.data.timeLimit > 0) {
            setTimeLeft(res.data.timeLimit * 60); // minutes → seconds
          }
        } else {
          setQuiz({ ...res.data, questions: [] });
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setQuiz({ questions: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const selectOption = (index) => {
    const updated = [...answers];
    updated[currentQ] = index;
    setAnswers(updated);
  };

  const submitQuiz = async () => {
    try {
      await API.post(`/attempts/${id}`, { answers });
      alert("Quiz submitted!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Failed to submit quiz.");
    }
  };

  // Timer countdown ⏱
  useEffect(() => {
    if (!started || !timeLeft) return;

    if (timeLeft <= 0) {
      alert("Time is up! Submitting quiz.");
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  if (loading) return <p className="text-center mt-20">Loading quiz...</p>;
  if (!quiz) return <p className="text-center mt-20">Quiz not found.</p>;
  if (!quiz.questions || quiz.questions.length === 0)
    return <p className="text-center mt-20">No questions in this quiz.</p>;

  // Instruction Page
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ul className="text-left list-disc list-inside text-gray-700 mb-6">
            <li>You will get {quiz.questions.length} questions.</li>
            <li>Each question has multiple choice answers, select one.</li>
            <li>Once submitted, you cannot change your answers.</li>
            <li>Do not refresh the page during the test.</li>
            <li>
              {quiz.timeLimit && quiz.timeLimit > 0
                ? `You will have ${quiz.timeLimit} minutes to complete the test.`
                : "No time limit for this test."}
            </li>
          </ul>

          <button
            onClick={() => setStarted(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // Format timer mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Update visited when navigating to a question
  const goToQuestion = (idx) => {
    setCurrentQ(idx);
    if (!visited.includes(idx)) {
      setVisited([...visited, idx]);
    }
  };

  // Toggle review mark for current question
  const toggleReview = () => {
    if (review.includes(currentQ)) {
      setReview(review.filter((q) => q !== currentQ));
    } else {
      setReview([...review, currentQ]);
    }
  };

  // Actual Quiz Page
  return (
    <div className="min-h-screen flex flex-col md:flex-row p-6 bg-gray-100">
      {/* Questions */}
      <div className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          {quiz.timeLimit > 0 && (
            <span className="text-red-600 font-semibold">
              Time Left: {formatTime(timeLeft)}
            </span>
          )}
        </div>

        <p className="mb-4">{quiz.questions[currentQ].question}</p>
        <div className="flex flex-col gap-2">
          {quiz.questions[currentQ].options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectOption(idx)}
              className={`px-4 py-2 rounded border ${
                answers[currentQ] === idx
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Review Button */}
        <button
          onClick={toggleReview}
          className={`mt-4 px-4 py-2 rounded ${
            review.includes(currentQ)
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          {review.includes(currentQ) ? "Unmark Review" : "Mark for Review"}
        </button>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => goToQuestion(Math.max(currentQ - 1, 0))}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={currentQ === 0}
          >
            Previous
          </button>
          {currentQ === quiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(currentQ + 1)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="md:w-1/4 mt-6 md:mt-0 md:ml-6 bg-white shadow-lg rounded-lg p-4 flex flex-wrap gap-2">
        {/* Legend */}
        <div className="flex flex-col w-full mb-2 text-sm">
          <p>
            <span className="inline-block w-4 h-4 bg-gray-200 mr-1"></span> Unvisited
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-yellow-300 mr-1"></span> Visited
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-green-500 mr-1"></span> Answered
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-purple-500 mr-1"></span> Marked Review
          </p>
        </div>

        {quiz.questions.map((_, idx) => {
          let bgClass = "bg-gray-200"; // default unvisited

          if (review.includes(idx)) bgClass = "bg-purple-500 text-white";
          else if (answers[idx] !== null) bgClass = "bg-green-500 text-white";
          else if (visited.includes(idx)) bgClass = "bg-yellow-300";

          if (currentQ === idx) bgClass += " border-2 border-blue-500";

          return (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SolveQuiz;
