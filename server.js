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
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Stine. Hvad vil du ellers vide om mig?",
  },
  {
    category: "alder",
    keywords: ["gammel", "år", "alder"],
    answer: "Jeg er 26 år gammel.",
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "lever", "hvor"],
    answer: "Jeg bor i Aarhus.",
  },
  {
    category: "hobbyer",
    keywords: ["hobby", "hobbyer", "fritid", "kan lide"],
    answer:
      "I min fritid kan jeg godt lide at tegne, strikke, gå til gymnastik og være sammen med min venner.",
  },
  {
    category: "sport",
    keywords: ["gå til", "går til", "sport", "hobby"],
    answer: "I min fritid går jeg til gymnastik.",
  },
];

const topicStats = {
  navn: 0,
  alder: 0,
  bosted: 0,
  hobbyer: 0,
  sport: 0,
};

//------------------------------- FUNKTIONER--------------------------
function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );
  return matches.length;
}

function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  let bestScore = 0;
  let bestAnswer = "Jeg er ikke sikker på, hvad du mener. Kan du uddybe?";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return { answer: bestAnswer, category: bestCategory };
}

function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, ""); //Fjerner kontroltegn og usynlige tegn fra inputtet
}

//----------------------ROUTES----------------------//

app.get("/", (req, res) => {
  res.render("index", { messages, error: "", topicStats });
});

app.post("/ask", (req, res) => {
  const rawQuestion = req.body.question;
  const question = sanitizeQuestion(rawQuestion).trim();

  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål før du trykker på send.";
  } else {
    messages.push({ type: "question", text: question });
    const result = findBestAnswer(question);

  if (result.category) {
    topicStats[result.category] += 1; //tilføjer 1 point til den kategori der matcher spørgsmålet
  }
    
    messages.push({ type: "answer", text: result.answer });
  }


  res.render("index", { messages:messages.slice(-4), error });
  res.render("index", { messages, error, topicStats });
});

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
