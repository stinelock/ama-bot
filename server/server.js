import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.json());

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
    normalizedQuestion.includes(keyword),
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

app.get("/messages", async (req, res) => {
    const messages = await loadMessages();
    res.json(messages);
  });


//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
