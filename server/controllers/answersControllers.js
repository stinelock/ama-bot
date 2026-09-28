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

    if (!answerRule) {
        res.status(404).json({ error: "Der findes ikke et svar med denne kategori" });
        return;
    }

	res.json(answerRule);
}

export async function createAnswer(req, res) {
	const answers = await loadAnswers();

	const newAnswerRule = {
		category: req.body.category,
		keywords: req.body.keywords,
		answer: req.body.answer,
	};

    if (!newAnswerRule.category || !newAnswerRule.keywords || !newAnswerRule.answer) {
		return res.status(400).json({ error: "En svarregel skal have en kategori, nøgleord og et svar" });
	}

	answers.push(newAnswerRule);
	await saveAnswers(answers);

	res.status(201).json(newAnswerRule);
}

export async function updateAnswer(req, res) {
	const answers = await loadAnswers();

	const answerRule = answers.find(
		(answer) => answer.category === req.params.category,
	);

    if (!answerRule) {
        res.status(404).json({ error: "Der findes ikke et svar med denne kategori" });
        return;
    }

     if (
			!req.body.category ||
			!req.body.keywords ||
			!req.body.answer
		) {
			return res
				.status(400)
				.json({
					error: "En svarregel skal have en kategori, nøgleord og et svar",
				});
		}
    

	answerRule.keywords = req.body.keywords;
	answerRule.answer = req.body.answer;
	await saveAnswers(answers);

	res.json(answerRule);
}

export async function deleteAnswer(req, res) {
	const answers = await loadAnswers();

    const answerRule = answers.find(
        (answer) => answer.category === req.params.category,
    );

    if (!answerRule) {
        res.status(404).json({ error: "Der findes ikke et svar med denne kategori" });
        return;
    }

	const updatedAnswers = answers.filter(
		(answer) => answer.category !== req.params.category,
	);

	await saveAnswers(updatedAnswers);
	res.status(204).send();
}
