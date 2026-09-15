const characterCounter = document.getElementById("character-count");
const submitBtn = document.getElementById("send-button");

document.addEventListener("input", handleInputChange);

function handleInputChange(event) {
  const inputValueLength = event.target.value.length;

  characterCounter.textContent = inputValueLength;

  if (inputValueLength > 0) {
    submitBtn.classList.toggle("inactive");
  }

  if (inputValueLength === 20) {
    characterCounter.classList.toggle("alert");
  } 

  console.log("Input ændret:", inputValueLength);

}

