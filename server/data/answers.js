import fs from "node:fs/promises";

export async function loadAnswers() {
	const data = await fs.readFile("./data/answers.json", "utf-8");
	const answers = JSON.parse(data);

	return answers;
}

export async function saveAnswers(answers) {
	const json = JSON.stringify(answers, null, 2);
	await fs.writeFile("./data/answers.json", json);
}
