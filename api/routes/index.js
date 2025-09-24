import express from "express";
const router = express.Router();

import { login, register } from "../controllers/authController.js";
import {
  createAsg,
  deleteAsg,
  listAsg,
  updateAsg,
} from "../controllers/assignmentController.js";
import {
  getForTeacher,
  getStudentSubmission,
  review,
  submit,
} from "../controllers/submissionController.js";
import { auth } from "../middleware/authMiddleware.js";
import { role } from "../middleware/roleMiddleware.js";

//Auth routes
router.post("/register", register);
router.post("/login", login);

//Assignment routes
router.post("/", auth, role(["teacher"]), createAsg);
router.patch("/:id", auth, role(["teacher"]), updateAsg);
router.delete("/:id", auth, role(["teacher"]), deleteAsg);
router.get("/", auth, listAsg);
// router.get("/:id", auth, getById); // implement getById to show details

//Submission routes
router.post("/:assignmentId", auth, role(["student"]), submit);
router.get("/assignment/:assignmentId", auth, role(["teacher"]), getForTeacher);
router.get("/me/:assignmentId", auth, role(["student"]), getStudentSubmission);
router.patch("/review/:submissionId", auth, role(["teacher"]), review);

export default router;
