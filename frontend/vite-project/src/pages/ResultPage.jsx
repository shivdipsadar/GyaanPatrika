import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await API.get(`/attempts/${attemptId}`);
        setAttempt(res.data);
        console.log("Fetched attempt:", res.data);
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  if (loading) return <p className="text-center mt-20">Loading result...</p>;
  if (!attempt) return <p className="text-center mt-20 text-red-500">Attempt not found</p>;

  const { quiz, answers, score } = attempt;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">{quiz.title}</span> — Score:{" "}
          <span className="text-green-600 font-bold">{score} / {quiz.questions.length}</span>
        </p>

        <div className="space-y-4">
          {quiz.questions.map((q, index) => {
            const userAnswer = answers.find(a => a.questionId === q._id);
            return (
              <div
                key={q._id}
                className="p-4 rounded-lg border bg-gray-50 shadow-sm"
              >
                <p className="font-semibold mb-2">
                  Q{index + 1}: {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = userAnswer?.selectedOption === idx;
                    const isCorrect = q.answer === opt;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded border ${
                          isCorrect
                            ? "bg-green-200 border-green-400"
                            : isSelected
                            ? "bg-red-200 border-red-400"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {opt} {isSelected && !isCorrect ? "(Your choice)" : ""}
                        {isCorrect ? " (Correct Answer)" : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate(`/leaderboard/${quiz._id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
