import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);

  // Fetch only quizzes created by this admin
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get("/quizzes/my-quizzes");
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setQuizLoading(false);
      }
    };
    if (user?.role === "admin") fetchQuizzes();
    else setQuizLoading(false);
  }, [user]);

  if (loading || quizLoading)
    return <p className="text-center mt-20">Loading...</p>;
  if (!user || user.role !== "admin")
    return <p className="text-center mt-20">Access Denied</p>;

  // Delete quiz handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await API.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard 🛠️</h1>

        {/* Admin Info & Navigation */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6">
          <div className="text-left mb-4 md:mb-0 space-y-1">
            <p className="text-gray-600">
              Logged in as: <span className="font-semibold">{user.username}</span>
            </p>
            <p className="text-gray-600">
              Email: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-gray-600">
              Role: <span className="font-semibold">{user.role}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              User Dashboard
            </Link>
          </div>
        </div>

        {/* Create Quiz Button */}
        <div className="mb-6 text-center">
          <Link
            to="/admin/create-quiz"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Create New Quiz
          </Link>
        </div>

        {/* Admin Quizzes */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Your Quizzes</h2>
        {quizzes.length === 0 ? (
          <p className="text-gray-500 text-center">No quizzes created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-gray-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-3">{quiz.description}</p>
                  <p className="text-gray-600">Questions: <span className="font-semibold">{quiz.questions?.length || 0}</span></p>
                </div>

                <div className="flex flex-col md:flex-row gap-2 mt-4">
                  <Link
                    to={`/admin/edit-quiz/${quiz._id}`}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/leaderboard/${quiz._id}`}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-center"
                  >
                    View Leaderboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
