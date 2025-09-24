import Assignment from "../api/models/Assignment.js";

const createAssignment = async (req) => Assignment.create(req);

const updateAssignment = async (id, updates, actor) => {
  const a = await Assignment.findById(id);
  if (!a) throw { status: 404, message: "Assignment not found" };

  // Only editable if Draft
  if (
    a.status !== "Draft" &&
    (updates.title || updates.description || updates.dueDate)
  ) {
    throw { status: 400, message: "Only Draft assignments are editable" };
  }

  // Teachers cannot change status backwards
  if (updates.status) {
    const allowed = {
      Draft: ["Published"],
      Published: ["Completed"],
      Completed: [],
    };
    if (!allowed[a.status].includes(updates.status)) {
      throw {
        status: 400,
        message: `Invalid status transition: ${a.status} -> ${updates.status}`,
      };
    }
  }

  Object.assign(a, updates);
  await a.save();
  return a;
};

const deleteAssignment = async (id) => {
  const a = await Assignment.findById(id);
  if (!a) throw { status: 404, message: "Assignment not found" };
  if (a.status !== "Draft")
    throw { status: 400, message: "Only Draft assignments can be deleted" };
  await a.remove();
  return;
};

export { createAssignment, updateAssignment, deleteAssignment };
