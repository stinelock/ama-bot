import { loadAnswers, saveAnswers } from "../data/answers.js";

export async function getAllAnswers(req, res) {
	const answers = await loadAnswers();

	res.json(answers);
}

export async function getAnswerByCategory(req, res) {
	const answers = await loadAnswers();

	const answerRule = answers.find(
		(answer) => answer.category === req.params.category,
	);

	res.json(answerRule);
}

export async function createAnswer(req, res) {
	const answers = await loadAnswers();

	const newAnswerRule = {
		category: req.body.category,
		keywords: req.body.keywords,
		answer: req.body.answer,
	};

	answers.push(newAnswerRule);
	await saveAnswers(answers);

	res.json(newAnswerRule);
}

export async function updateAnswer(req, res) {
	const answers = await loadAnswers();

	const answerRule = answers.find(
		(answer) => answer.category === req.params.category,
	);

	answerRule.keywords = req.body.keywords;
	answerRule.answer = req.body.answer;
	await saveAnswers(answers);

	res.json(answerRule);
}

export async function deleteAnswer(req, res) {
	const answers = await loadAnswers();

	const updatedAnswers = answers.filter(
		(answer) => answer.category !== req.params.category,
	);

	await saveAnswers(updatedAnswers);
	res.send();
}
