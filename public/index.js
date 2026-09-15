const characterCounter = document.getElementById("character-count");
const characterCounterContainer = document.querySelectorAll("span")
const submitBtn = document.getElementById("send-button");


document.addEventListener("input", handleInputChange);

function handleInputChange(event) {
  const inputValueLength = event.target.value.length;

  characterCounter.textContent = inputValueLength;

  if (inputValueLength > 0) {
    submitBtn.classList.add("active");
  } else {
    submitBtn.classList.remove("active")
  }

  if (inputValueLength === 20) {
    characterCounterContainer.classList.toggle("alert");
  } 

  console.log("Input ændret:", inputValueLength);

}

