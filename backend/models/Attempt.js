import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedOption: { type: Number, required: true } // index of chosen option
    }
  ],
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Attempt", attemptSchema);
