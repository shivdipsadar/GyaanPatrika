import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";

// Submit a quiz attempt
export const submitAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // array of selected option indices

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    // Map answers to Attempt model
    const attemptAnswers = quiz.questions.map((q, idx) => ({
      questionId: q._id,
      selectedOption: answers[idx],
    }));

    const attempt = await Attempt.create({
      user: req.user.id || req.user._id,
      quiz: quizId,
      answers: attemptAnswers,
      score,
    });

    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit attempt", error: err.message });
  }
};

// Get all attempts by logged-in user
export const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id || req.user._id })
      .populate("quiz", "title description");
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attempts", error: err.message });
  }
};

// Get attempt by ID (for Result page)
export const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate("quiz");
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attempt", error: err.message });
  }
};
