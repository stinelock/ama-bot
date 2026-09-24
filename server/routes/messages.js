import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";
import { findBestAnswer, sanitizeQuestion } from "../data/answerLogic.js";
import { getAllMessages, createMessage, deleteAllMessages } from "../controllers/messagesControllers.js";


const router = express.Router();


router.get("/", getAllMessages);

router.post("/", createMessage);

router.delete("/", deleteAllMessages);

export default router;
