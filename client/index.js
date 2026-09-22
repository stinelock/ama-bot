const form = document.getElementById("chat-form");

form.addEventlistener("submit", handleFormSubmit);

function handleFormSubmit(event) {
	event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log(data);


	console.log("Form submitted");
}

handleFormSubmit();