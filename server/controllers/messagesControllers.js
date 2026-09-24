import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";
import { findBestAnswer, sanitizeQuestion } from "../data/answerLogic.js";

export async function getAllMessages(req, res) {
	const messages = await loadMessages();
	res.json(messages);
}


export async function createMessage(req, res) {
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
		createdAt: new Date().toLocaleString("da-DK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
	};
	messages.push(message);


	const result = findBestAnswer(question, answers);

	const answerMessage = {
		type: "answer",
		text: result.answer,
		category: result.category,
		createdAt: new Date().toLocaleString("da-DK", {
			hour: "2-digit",
			minute: "2-digit",
		}),
	};
	messages.push(answerMessage);

	await saveMessages(messages);

	res.json({ question: message, answer: answerMessage });
}



export async function deleteAllMessages(req, res) {
	await saveMessages([]);

	res.send();
}
