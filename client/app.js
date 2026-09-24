const chatForm = document.getElementById("chat-form");
const chatSection = document.querySelector(".chat-section");
const introSection = document.getElementById("intro-section");
const questionInput = document.getElementById("question");
const sendBtn = document.getElementById("send-button");
const clearBtn = document.getElementById("clear-chat-btn");

const API_URL = "http://localhost:8000";

async function getMessages() {
	try {
		const res = await fetch(`${API_URL}/messages`);

		if (!res.ok) {
			throw new Error(`Server error: ${res.status}`);
		}

		const messages = await res.json();
		if (messages.length === 0) {
			introSection.classList.remove("hidden");
		} else {
			introSection.classList.add("hidden");
		}

		for (message of messages) {
			displayMessage(message);
		}
	} catch (error) {
		console.log("fejl i fetch af data");
	}
}

getMessages();

function displayMessage(message) {
	const html = `<article class="chat-box">
                    <div class="${message.type}">
                        <p>${message.text}</p>
                    </div>
                    <p class="timestamp">${message.createdAt}</p>
                </article>`;

	chatSection.insertAdjacentHTML("beforeend", html);
}

chatForm.addEventListener("submit", handleChatSubmit);

async function handleChatSubmit(event) {
	event.preventDefault();

	const question = questionInput.value.trim();

	try {
		const res = await fetch(`${API_URL}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ question }),
		});

		if (!res.ok) {
			throw new Error(`Server error: ${res.status}`);
		}

		const data = await res.json();

        introSection.classList.add("hidden");
		displayMessage(data.question);
		displayMessage(data.answer);

		questionInput.value = "";
	} catch (error) {
		console.error("Error submitting question:", error);
	}
}

clearBtn.addEventListener("click", clearChat);

async function clearChat() {
	try {
		const res = await fetch(`${API_URL}/messages`, {
			method: "DELETE",
		});

		if (!res.ok) {
			throw new Error(`Server error: ${res.status}`);
		}

		chatSection.innerHTML = "";
		introSection.classList.remove("hidden");
	} catch (error) {
		console.error("Error submitting question:", error);
	}
}
