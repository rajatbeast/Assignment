import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  reviewNotes: {
    type: String,
    default: "",
  },
});

// Ensure unique student per assignment
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("Submission", SubmissionSchema);
