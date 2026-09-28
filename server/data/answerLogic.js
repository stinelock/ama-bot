export function countMatches(keywords, normalizedQuestion) {
	const matches = keywords.filter((keyword) =>
		normalizedQuestion.includes(keyword),
	);
	return matches.length;
}

export function findBestAnswer(question, answers) {
	const normalizedQuestion = question.toLowerCase();

	let bestScore = 0;
	let bestAnswer = "Jeg er ikke sikker på, hvad du mener. Prøv at omformulere dit spørgsmål.";
	let bestCategory = "";

	for (const answerGroup of answers) {
		const score = countMatches(answerGroup.keywords, normalizedQuestion);

        console.log(`Score for answer "${answerGroup.category}": ${score}`);

		if (score === bestScore && score > 0) {
			bestAnswer += ` ${answerGroup.answer}`;
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