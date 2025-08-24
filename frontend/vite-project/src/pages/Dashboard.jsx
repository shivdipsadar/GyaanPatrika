import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import dayjs from "dayjs";
import {
  User,
  Mail,
  ListChecks,
  Clock,
  Calendar,
  Trophy,
  Share2,
  PlayCircle,
  FileText,
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
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
        // ✅ filter out invalid attempts (where quiz is null)
        setAttempts(attemptRes.data.filter((a) => a.quiz && a.quiz._id));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Safe check
  const getAttempt = (quizId) =>
    attempts.find(
      (a) => a.quiz && a.quiz._id && a.quiz._id.toString() === quizId.toString()
    );

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;

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
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between border border-gray-200">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {quiz.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-3 mb-3">
            {quiz.description}
          </p>
          <div className="text-gray-600 text-sm space-y-2">
            <p className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Questions:</span> {questionsCount}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="font-semibold">Time Limit:</span>{" "}
              {quiz.timeLimit === 0 ? "No Time Limit" : `${quiz.timeLimit} mins`}
            </p>
            {quiz.createdAt && (
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="font-semibold">Created:</span>{" "}
                {dayjs(quiz.createdAt).format("DD MMM YYYY")}
              </p>
            )}
            {attempt && (
              <p className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">Score:</span> {attempt.score} /{" "}
                {questionsCount}
              </p>
            )}
            {attempt && attempt.createdAt && (
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="font-semibold">Attempted on:</span>{" "}
                {dayjs(attempt.createdAt).format("DD MMM YYYY, HH:mm")}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
          {attempted ? (
            <Link
              to={`/result/${attempt?._id}`}
              className="flex items-center justify-center gap-2 w-full md:w-1/2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              <Trophy className="w-4 h-4" /> View Result
            </Link>
          ) : (
            <Link
              to={`/solve-quiz/${quiz._id}`}
              className="flex items-center justify-center gap-2 w-full md:w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              <PlayCircle className="w-4 h-4" /> Start Quiz
            </Link>
          )}
          <button
            onClick={() => handleShare(quiz._id)}
            className="flex items-center justify-center gap-2 w-full md:w-1/2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Your Dashboard 🎉
        </h1>

        {user && (
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6">
            <div className="text-left mb-4 md:mb-0 space-y-1">
              <p className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                Logged in as:{" "}
                <span className="font-semibold">{user.username}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-green-500" />
                Email: <span className="font-semibold">{user.email}</span>
              </p>
            </div>

            {/* Admin Dashboard Link */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                ⚡ Admin Dashboard
              </Link>
            )}
          </div>
        )}

        {/* Not Attempted Quizzes */}
        {notAttemptedQuizzes.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Quizzes to Attempt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {notAttemptedQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} attempted={false} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic mb-8 text-center">
            🎯 You’ve attempted all available quizzes!
          </p>
        )}

        {/* Attempted Quizzes */}
        {attemptedQuizzes.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Attempted Quizzes
            </h2>
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
