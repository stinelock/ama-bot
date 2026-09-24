import express from "express";
import {getAllAnswers, getAnswerByCategory, createAnswer, updateAnswer, deleteAnswer} from "../controllers/answersControllers.js";

const router = express.Router();

router.get("/", getAllAnswers);
router.get("/:category", getAnswerByCategory);
router.post("/", createAnswer);
router.put("/:category", updateAnswer);
router.delete("/:category", deleteAnswer);

export default router;