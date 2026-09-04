import express from "express";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.static("public")); // Giver express adgang til min public mappe
app.use(express.urlencoded({ extended: true })); // Giver express adgang til at parse data fra formular
app.set("view engine", "ejs");

//---------------------SAMTALELOGIK---------------------//

const messages = [];

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Stine. Hvad vil du ellers vide om mig?",
  },
  {
    keywords: ["gammel", "år", "alder"],
    answer: "Jeg er 26 år gammel.",
  },
  {
    keywords: ["bor", "by", "hvem er du"],
    answer: "Jeg bor i Aarhus.",
  },
  {
    keywords: ["hobby", "hobbyer", "fritid", "kan lide"],
    answer:
      "I min fritid kan jeg godt lide at tegne, strikke, gå til gymnastik og være sammen med min venner.",
  },
  {
    keywords: ["gå til", "går til", "sport", "hobby"],
    answer: "I min fritid går jeg til gymnastik.",
  },
];

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword)
    );

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Jeg er ikke sikker på, hvad du mener. Kan du uddybe?";
}

function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, ""); //Fjerner kontroltegn og usynlige tegn fra inputtet
}

//----------------------ROUTES----------------------//

app.get("/", (req, res) => {
  res.render("index", { messages, error: "" });
});

app.post("/ask", (req, res) => {
  const rawQuestion = req.body.question;
  const question = sanitizeQuestion(rawQuestion).trim();

  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål før du trykker på send.";
  } else {
    messages.push({ type: "question", text: question });
    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });
  }


  res.render("index", { messages:messages.slice(-6), error });
});

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
