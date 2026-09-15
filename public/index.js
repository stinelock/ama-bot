const characterCounter = document.getElementById("character-count");
const characterLimit = document.getElementById("character-limit");
const characterCountMessage = document.getElementById("character-count-message");
const submitBtn = document.getElementById("send-button");


document.addEventListener("input", handleInputChange);

function handleInputChange(event) {
  const inputValueLength = event.target.value.length;

  characterCounter.textContent = inputValueLength;

  if (inputValueLength > 0) {
    submitBtn.classList.add("active");
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.remove("active")
    submitBtn.disabled = true;
  }

  if (inputValueLength === 250) {
    characterCounter.classList.add("alert");
    characterLimit.classList.add("alert");
    characterCountMessage.textContent = "Du har nået maksimum antal karakterer.";
  } else {
    characterCounter.classList.remove("alert");
    characterLimit.classList.remove("alert");
    characterCountMessage.textContent = "";
  }

  console.log("Input ændret:", inputValueLength);

}

