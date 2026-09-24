import express from "express";
import { getAllMessages, createMessage, deleteAllMessages } from "../controllers/messagesControllers.js";

const router = express.Router();


router.get("/", getAllMessages);
router.post("/", createMessage);
router.delete("/", deleteAllMessages);

export default router;
