import Quiz from "../models/Quiz.js";

// @desc   Create quiz (Admin only)
// @route  POST /api/quizzes
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, timeLimit } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || q.options.length < 2 || !q.answer) {
        return res.status(400).json({ message: `Invalid question at index ${i}` });
      }
      if (!q.options.includes(q.answer)) {
        return res
          .status(400)
          .json({ message: `Answer must be one of the options for question ${i + 1}` });
      }
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      timeLimit: timeLimit || 0, // default to 0 → no limit
      createdBy: req.user.id,
    });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Failed to create quiz", error: err.message });
  }
};

// @desc   Update quiz (Admin only)
// @route  PUT /api/quizzes/:id
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Only creator can update
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, questions, timeLimit } = req.body;
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;
    quiz.timeLimit = timeLimit !== undefined ? timeLimit : quiz.timeLimit;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all quizzes
// @route  GET /api/quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    // include questions so frontend can count them
    const quizzes = await Quiz.find().select("title description createdAt createdBy timeLimit questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes", error: err.message });
  }
};


// @desc   Get quiz by ID
// @route  GET /api/quizzes/:id
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "username email");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz", error: err.message });
  }
};

// @desc   Delete quiz
// @route  DELETE /api/quizzes/:id
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete quiz", error: err.message });
  }
};

// @desc   Get quizzes created by admin
// @route  GET /api/quizzes/admin
export const getAdminQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).select(
      "title description createdAt timeLimit questions"
    );

    const quizzesWithCount = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      createdAt: q.createdAt,
      timeLimit: q.timeLimit,
      questionsCount: q.questions.length,
    }));

    res.json(quizzesWithCount);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your quizzes", error: err.message });
  }
};
