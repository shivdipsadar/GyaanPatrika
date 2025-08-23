import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const navigate = useNavigate();
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    timeLimit: 0, // in minutes
    questions: [
      {
        question: "",
        options: ["", "", "", ""], // default 4 options
        correctAnswer: 0, // index of correct option
      },
    ],
  });

  const handleChangeQuestion = (qIndex, field, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex][field] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleChangeOption = (qIndex, optIndex, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleCorrectAnswer = (qIndex, optIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].correctAnswer = optIndex;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Transform questions for backend
      const payload = {
        title: quizForm.title,
        description: quizForm.description,
        timeLimit: quizForm.timeLimit, // include time limit
        questions: quizForm.questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.options[q.correctAnswer], // store correct answer string
        })),
      };

      await API.post("/quizzes", payload);
      navigate("/admin"); // back to dashboard
    } catch (err) {
      console.error("Failed to create quiz:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizForm.title}
          onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={quizForm.description}
          onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Time Limit (minutes)"
          value={quizForm.timeLimit}
          onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) || 0 })}
          className="w-full p-2 border rounded mb-4"
          min={0}
        />

        {quizForm.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 border p-3 rounded">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => handleChangeQuestion(qIndex, "question", e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} className="flex items-center gap-2 border p-2 rounded">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === optIndex}
                    onChange={() => handleCorrectAnswer(qIndex, optIndex)}
                    required
                  />
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleChangeOption(qIndex, optIndex, e.target.value)}
                    className="w-full p-1 border rounded"
                    required
                  />
                </label>
              ))}
            </div>
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
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
