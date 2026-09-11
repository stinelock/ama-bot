import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.static("public")); // Giver express adgang til min public mappe
app.use(express.urlencoded({ extended: true })); // Giver express adgang til at parse data fra formular
app.set("view engine", "ejs");

//---------------------SAMTALELOGIK---------------------//
const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Stine.",
  },
  {
    category: "alder",
    keywords: ["gammel", "år", "alder"],
    answer: "Jeg er 26 år gammel.",
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "lever"],
    answer: "Jeg bor på Frederiksbjerg i Aarhus.",
  },
  {
    category: "hobbyer",
    keywords: ["hobby", "hobbyer", "fritid", "kan lide"],
    answer:
      "I min fritid kan jeg godt lide at tegne, strikke, gå til gymnastik og være sammen med min venner.",
  },
  {
    category: "sport",
    keywords: ["går", "gå til", "går du til", "sport"],
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
async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf-8");
  const messages = JSON.parse(data);

  return messages;
}

async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}

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

    console.log(`Score for category "${answerGroup.category}": ${score}`);

    if (score === bestScore && score > 0) {
      if (typeof bestCategory === "string") {
        bestCategory = [bestCategory];
      }

      bestAnswer += ` ${answerGroup.answer}`;
      bestCategory.push(answerGroup.category);
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  console.log(bestCategory);

  return { answer: bestAnswer, category: bestCategory };
}

function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, ""); //Fjerner kontroltegn og usynlige tegn fra inputtet
}

//----------------------ROUTES----------------------//

app.get("/", async (req, res) => {
  const messages = await loadMessages();
  res.render("index", { messages: messages.slice(-4), error: "", topicStats });
});

app.post("/ask", async (req, res) => {
  const messages = await loadMessages();

  const rawQuestion = req.body.question;
  const question = sanitizeQuestion(rawQuestion).trim();

  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål før du trykker på send.";
  } else {
    messages.push({ type: "question", text: question });
    const result = findBestAnswer(question);

    if (result.category) {
      if (Array.isArray(result.category)) {
        result.category.forEach((category) => {
          topicStats[category] += 1;
        });
      } else {
        topicStats[result.category] += 1; //tilføjer 1 point til den kategori der matcher spørgsmålet
      }
    }

    messages.push({ type: "answer", text: result.answer });
  }

  await saveMessages(messages);

  res.render("index", { messages: messages.slice(-4), error, topicStats });
});

app.post("/reset", async (req, res) => {
  const messages = loadMessages();
  const resetMessages = []; 

 await saveMessages(resetMessages)

 res.redirect("/");
})

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
