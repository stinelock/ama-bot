const characterCounter = document.getElementById("character-count");
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

  if (inputValueLength === 20) {
    characterCounter.classList.toggle("alert");
    characterCountMessage.textContent = "Du har nået maksimum antal karakterer.";
  } else {
    characterCountMessage.textContent = "";
  }

  console.log("Input ændret:", inputValueLength);

}

