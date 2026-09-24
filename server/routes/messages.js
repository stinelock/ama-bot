import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";


const router = express.Router();

router.get("/", async (req, res) => {
	const messages = await loadMessages();

	res.json(messages);
});

router.post("/", async (req, res) => {
	const messages = await loadMessages();
	const rawQuestion = req.body.question.trim();
	const question = sanitizeQuestion(rawQuestion);
	const answers = await loadAnswers();

	if (!question) {
		res.json({ error: "Skriv et spørgsmål, før du sender." });
		return;
	}

	const message = {
		type: "question",
		text: question,
		createdAt: new Date().toISOString(),
	};
	messages.push(message);

	const result = findBestAnswer(question, answers);

	const answerMessage = {
		type: "answer",
		text: result.answer,
		category: result.category,
		createdAt: new Date().toISOString(),
	};
	messages.push(answerMessage);

	await saveMessages(messages);

	res.json({ question: message, answer: answerMessage });
});

router.delete("/", async (req, res) => {
	await saveMessages([]);

	res.send();
});

export default router;
