const characterCounter = document.getElementById("character-count");
const characterLimit = document.getElementById("character-limit");
const characterCountMessage = document.getElementById(
	"character-count-message",
);
const submitBtn = document.getElementById("send-button");

document.addEventListener("input", handleInputChange);

function handleInputChange(event) {
	const inputValueLength = event.target.value.length;

	characterCounter.textContent = inputValueLength;

	if (inputValueLength > 0) {
		submitBtn.classList.add("active");
	} else {
		submitBtn.classList.remove("active");
	}

	if (inputValueLength === 250) {
		characterCounter.classList.add("alert");
		characterLimit.classList.add("alert");
	} else {
		characterCounter.classList.remove("alert");
		characterLimit.classList.remove("alert");
	}
}
