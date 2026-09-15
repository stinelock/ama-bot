document.addEventListener("input", handleInputChange);

function handleInputChange(event) {
  const inputValueLength = event.target.value.length;

  console.log("Input ændret:", inputValueLength);

}

