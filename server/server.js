import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.json());

//----------------------STATS----------------------//

const topicStats = {
	navn: 0,
	alder: 0,
	bosted: 0,
	hobbyer: 0,
	sport: 0,
};

//------------------------------- FUNKTIONER--------------------------
async function loadMessages() {
	const data = await fs.readFile("./data/messages.json", "utf-8");
	const messages = JSON.parse(data);

	return messages;
}

async function saveMessages(messages) {
	const json = JSON.stringify(messages, null, 2);
	await fs.writeFile("./data/messages.json", json);
}

async function loadAnswers() {
	const data = await fs.readFile("./data/answers.json", "utf-8");
	const answers = JSON.parse(data);

	return answers;
}

async function saveAnswers(answers) {
	const json = JSON.stringify(answers, null, 2);
	await fs.writeFile("./data/answers.json", json);
}

function countMatches(keywords, normalizedQuestion) {
	const matches = keywords.filter((keyword) =>
		normalizedQuestion.includes(keyword),
	);
	return matches.length;
}

function findBestAnswer(question, answers) {
	const normalizedQuestion = question.toLowerCase();

	let bestScore = 0;
	let bestAnswer = "Jeg er ikke sikker på, hvad du mener. Kan du uddybe?";
	let bestCategory = "";

	for (const answerGroup of answers) {
		const score = countMatches(answerGroup.keywords, normalizedQuestion);

		if (score === bestScore && score > 0) {
			if (typeof bestCategory === "string") {
				bestCategory = [bestCategory];
			}

			bestAnswer += ` ${answerGroup.answer}`;
			bestCategory.push(answerGroup.category);
		}
		if (score > bestScore) {
			bestScore = score;
			bestAnswer = answerGroup.answer;
			bestCategory = answerGroup.category;
		}
	}

	return { answer: bestAnswer, category: bestCategory };
}

function sanitizeQuestion(input) {
	return input.replace(/[\u0000-\u001F\u007F]/g, ""); //Fjerner kontroltegn og usynlige tegn fra inputtet
}

//----------------------REST API ROUTES----------------------//

app.get("/messages", async (req, res) => {
	const messages = await loadMessages();

	res.json(messages);
});

app.post("/messages", async (req, res) => {
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

app.delete("/messages", async (req, res) => {
	await saveMessages([]);

	res.send();
});

app.get("/answers", async (req, res) => {
	const answers = await loadAnswers();

	res.json(answers);
});

app.get("/answers/:category", async (req, res) => {
	const answers = await loadAnswers();

	const answerRule = answers.find(
		(answer) => answer.category === req.params.category,
	);

	res.json(answerRule);
});

app.post("/answers", async (req, res) => {
	const answers = await loadAnswers();

	const newAnswerRule = {
		category: req.body.category,
		keywords: req.body.keywords,
		answer: req.body.answer,
	};

	answers.push(newAnswerRule);
	await saveAnswers(answers);

	res.json(newAnswerRule);
});

app.put("/answers/:category", async (req, res) => {
	const answers = await loadAnswers();

	const answerRule = answers.find(
		(answer) => answer.category === req.params.category,
	);

	answerRule.keywords = req.body.keywords;
	answerRule.answer = req.body.answer;
	await saveAnswers(answers);

	res.json(answerRule);
});

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
	console.log(`Server is runnning at http://localhost:${port}`);
});
