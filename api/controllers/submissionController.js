import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

const submit = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { answerText } = req.body;

    const asg = await Assignment.findById(assignmentId);
    if (!asg) return res.status(404).json({ message: "Assignment not found" });
    if (asg.status !== "Published")
      return res
        .status(400)
        .json({ message: "Assignment not open for submissions" });

    // Prevent late submissions
    if (new Date() > new Date(asg.dueDate)) {
      return res.status(400).json({ message: "Cannot submit after due date" });
    }

    // Unique index prevents duplicates; we can check before create to return friendly error
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });
    if (existing)
      return res.status(400).json({ message: "You have already submitted" });

    const sub = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      answerText,
    });
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
};

const getForTeacher = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const subs = await Submission.find({ assignment: assignmentId }).populate(
      "student",
      "name email"
    );
    res.json(subs);
  } catch (err) {
    next(err);
  }
};

const getStudentSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const sub = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });
    if (!sub) return res.status(404).json({ message: "No submission found" });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

const review = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const sub = await Submission.findById(submissionId);
    if (!sub) return res.status(404).json({ message: "Submission not found" });

    // Teacher marks reviewed -> and (optionally) mark assignment Completed after reviewing all submissions
    sub.reviewed = true;
    sub.reviewNotes = req.body.reviewNotes || sub.reviewNotes;
    await sub.save();
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

export { submit, getForTeacher, getStudentSubmission, review };
