import { useState, useEffect } from "react";
import API from "../utils/api";

function QuizForm({ editingQuiz, setEditingQuiz, fetchQuizzes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: [], answer: "" }]);

  useEffect(() => {
    if (editingQuiz) {
      setTitle(editingQuiz.title);
      setDescription(editingQuiz.description || "");
      setQuestions(editingQuiz.questions || [{ question: "", options: [], answer: "" }]);
    } else {
      setTitle("");
      setDescription("");
      setQuestions([{ question: "", options: [], answer: "" }]);
    }
  }, [editingQuiz]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: [], answer: "" }]);
  };

  const handleChangeQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await API.put(`/quizzes/${editingQuiz._id}`, { title, description, questions });
      } else {
        await API.post("/quizzes", { title, description, questions });
      }
      fetchQuizzes();
      setEditingQuiz(null);
      setTitle("");
      setDescription("");
      setQuestions([{ question: "", options: [], answer: "" }]);
    } catch (err) {
      console.error("Failed to save quiz:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-2xl font-semibold mb-4">{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</h3>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <h4 className="font-semibold mb-2">Questions</h4>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-3 border p-2 rounded">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => handleChangeQuestion(idx, "question", e.target.value)}
            className="w-full p-1 border rounded mb-1"
            required
          />
          <input
            type="text"
            placeholder="Answer"
            value={q.answer}
            onChange={(e) => handleChangeQuestion(idx, "answer", e.target.value)}
            className="w-full p-1 border rounded mb-1"
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddQuestion}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Add Question
      </button>

      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {editingQuiz ? "Update Quiz" : "Create Quiz"}
      </button>
    </form>
  );
}

export default QuizForm;
