import fs from "node:fs/promises";

export async function loadAnswers() {
	try {
		const data = await fs.readFile("./data/answers.json", "utf-8");
		const answers = JSON.parse(data);
		return answers;
	} catch (error) {
		throw new Error("Data for svar er findes ikke eller er ugyldig.");
	}
}

export async function saveAnswers(answers) {
	const json = JSON.stringify(answers, null, 2);
	await fs.writeFile("./data/answers.json", json);
}
