import fs from "node:fs/promises";

export async function loadMessages() {
	try {
		const data = await fs.readFile("./data/messages.json", "utf-8");
		const messages = JSON.parse(data);
		return messages;
	} catch (error) {
        throw new Error("Data for beskeder er findes ikke eller er ugyldig.");
    }
}

export async function saveMessages(messages) {
	const json = JSON.stringify(messages, null, 2);
	await fs.writeFile("./data/messages.json", json);
}
