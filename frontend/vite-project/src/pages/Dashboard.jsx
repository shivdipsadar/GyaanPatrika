import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import dayjs from "dayjs";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          API.get("/quizzes"),
          API.get("/attempts/my-attempts"),
        ]);
        setQuizzes(quizRes.data);
        setAttempts(attemptRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAttempt = (quizId) => attempts.find((a) => a.quiz._id.toString() === quizId.toString());

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  const attemptedQuizzes = quizzes.filter((q) => getAttempt(q._id));
  const notAttemptedQuizzes = quizzes.filter((q) => !getAttempt(q._id));

  const handleShare = (quizId) => {
    const link = `${window.location.origin}/solve-quiz/${quizId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Quiz link copied to clipboard!");
    });
  };

  const QuizCard = ({ quiz, attempted }) => {
    const attempt = getAttempt(quiz._id);
    const questionsCount = quiz.questions?.length || 0;

    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between border-l-4 border-blue-500">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-3 mb-3">{quiz.description}</p>
          <div className="text-gray-600 text-sm space-y-1">
            <p><span className="font-semibold">Questions:</span> {questionsCount}</p>
            <p><span className="font-semibold">Time Limit:</span> {quiz.timeLimit === 0 ? "No Time Limit" : `${quiz.timeLimit} mins`}</p>
            {quiz.createdAt && <p><span className="font-semibold">Created:</span> {dayjs(quiz.createdAt).format("DD MMM YYYY")}</p>}
            {attempt && <p><span className="font-semibold">Score:</span> {attempt.score} / {questionsCount}</p>}
            {attempt && attempt.createdAt && <p><span className="font-semibold">Attempted on:</span> {dayjs(attempt.createdAt).format("DD MMM YYYY, HH:mm")}</p>}
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
          {attempted ? (
            <button
              onClick={() => navigate(`/result/${attempt._id}`)}
              className="w-full md:w-1/2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              View Result
            </button>
          ) : (
            <button
              onClick={() => navigate(`/solve-quiz/${quiz._id}`)}
              className="w-full md:w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Start Quiz
            </button>
          )}
          <button
            onClick={() => handleShare(quiz._id)}
            className="w-full md:w-1/2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Dashboard 🎉</h1>

        {user && (
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-left mb-4 md:mb-0">
              <p className="text-gray-600">Logged in as: <span className="font-semibold">{user.username}</span></p>
              <p className="text-gray-600">Email: <span className="font-semibold">{user.email}</span></p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}

        {notAttemptedQuizzes.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Quizzes to Attempt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {notAttemptedQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} attempted={false} />
              ))}
            </div>
          </>
        )}

        {attemptedQuizzes.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Attempted Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attemptedQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} attempted={true} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
