import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }, // correct option
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 0 }, // in minutes, set by admin
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
