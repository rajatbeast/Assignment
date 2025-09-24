import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../../services/assignmentService.js";
import Assignment from "../models/Assignment.js";

const createAsg = async (req, res, next) => {
  console.log(req);
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      dueDate: new Date(req.body.dueDate),
      createdBy: req.user._id,
    };
    const asg = await createAssignment(data);
    console.log("asg>>>>>>>>>>", asg);
    res.status(201).json(asg);
  } catch (err) {
    console.log("error");
    next(err);
  }
};

const updateAsg = async (req, res, next) => {
  try {
    const asg = await updateAssignment(req.params.id, req.body, req.user);
    res.json(asg);
  } catch (err) {
    next(err);
  }
};

const deleteAsg = async (req, res, next) => {
  try {
    await deleteAssignment(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// List with filtering & pagination
const listAsg = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    // If student, show only Published
    if (req.user.role === "student") filter.status = "Published";

    const skip = (page - 1) * limit;
    const total = await Assignment.countDocuments(filter);
    const items = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    next(err);
  }
};

export { createAsg, updateAsg, deleteAsg, listAsg };
