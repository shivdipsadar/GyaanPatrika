import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: "", description: "", timeLimit: 0, questions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index].question = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleAnswerChange = (qIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].answer = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { question: "", options: ["", ""], answer: "" }],
    });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push("");
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/quizzes/${id}`, quiz);
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Failed to update quiz");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>

        <input
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded mb-4"
        />

        <textarea
          name="description"
          value={quiz.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="number"
          name="timeLimit"
          value={quiz.timeLimit || 0}
          onChange={handleChange}
          placeholder="Time Limit (minutes)"
          className="w-full p-2 border rounded mb-4"
          min={0}
        />

        <h2 className="text-xl font-semibold mb-2">Questions</h2>
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="mb-4 p-3 border rounded bg-gray-50">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qi, e.target.value)}
              placeholder={`Question ${qi + 1}`}
              className="w-full p-2 border rounded mb-2"
            />
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className="p-2 border rounded flex-1"
                />
                <input
                  type="radio"
                  name={`answer-${qi}`}
                  checked={q.answer === opt}
                  onChange={() => handleAnswerChange(qi, opt)}
                  className="w-4 h-4"
                />
              </div>
            ))}
            <button
              onClick={() => addOption(qi)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mt-2"
            >
              Add Option
            </button>
          </div>
        ))}
        <button
          onClick={addQuestion}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition mb-4"
        >
          Add Question
        </button>

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Update Quiz
        </button>
      </div>
    </div>
  );
}

export default EditQuiz;
