export function countMatches(keywords, normalizedQuestion) {
	const matches = keywords.filter((keyword) =>
		normalizedQuestion.includes(keyword),
	);
	return matches.length;
}

export function findBestAnswer(question, answers) {
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

export function sanitizeQuestion(input) {
	return input.replace(/[\u0000-\u001F\u007F]/g, ""); //Fjerner kontroltegn og usynlige tegn fra inputtet
}

const topicStats = {
	navn: 0,
	alder: 0,
	bosted: 0,
	hobbyer: 0,
	sport: 0,
};