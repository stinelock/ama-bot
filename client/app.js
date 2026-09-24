const chatForm = document.getElementById("chat-form");
const chatSection = document.querySelector(".chat-section");
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

        for (message of messages){
            displayMessage(message)
        }

        console.log(messages);

	} catch (error) {
		console.log("fejl i fetch af data");
	}
}

function displayMessage(message) {
	const html = `<article class="chat-box">
                    <div class="${message.type}">
                        <p>${message.text}</p>
                    </div>
                    <p class="timestamp">${message.createdAt}</p>
                </article>`;

	chatSection.insertAdjacentHTML("beforeend", html);
}

displayMessage({ type: "question", text: "Test", createdAt: "now" });
displayMessage({ type: "answer", text: "Test" });

getMessages()