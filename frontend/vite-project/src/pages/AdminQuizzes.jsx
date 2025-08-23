import { useState, useEffect } from "react";
import API from "../utils/api";
import QuizForm from "../components/QuizForm";

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await API.get("/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Delete quiz
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await API.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Quizzes</h2>

      {/* Quiz Form for Create / Edit */}
      <QuizForm
        editingQuiz={editingQuiz}
        setEditingQuiz={setEditingQuiz}
        fetchQuizzes={fetchQuizzes}
      />

      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
              <p className="text-gray-500 text-sm">
                Created at: {new Date(quiz.createdAt).toLocaleString()}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingQuiz(quiz)}
                  className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminQuizzes;
