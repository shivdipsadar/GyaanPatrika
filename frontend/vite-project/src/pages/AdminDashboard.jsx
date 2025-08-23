import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
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
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard 🛠️</h1>

        <p className="text-gray-600 mb-2">
          Logged in as: <span className="font-semibold">{user.username}</span>
        </p>
        <p className="text-gray-600 mb-2">
          Email: <span className="font-semibold">{user.email}</span>
        </p>
        <p className="text-gray-600 mb-4">
          Role: <span className="font-semibold">{user.role}</span>
        </p>

        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mb-6"
        >
          Logout
        </button>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => navigate("/admin/create-quiz")}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Create New Quiz
          </button>

          <h2 className="text-2xl font-bold mt-6 mb-4">Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes created yet.</p>
          ) : (
            quizzes.map((q) => (
              <div
                key={q._id}
                className="bg-gray-100 p-4 rounded-lg shadow mb-2 flex justify-between items-center"
              >
                <div className="text-left">
                  <p className="font-semibold">{q.title}</p>
                  <p className="text-gray-600 text-sm">{q.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/edit-quiz/${q._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
