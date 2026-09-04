import express from "express";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.static("public")); // Giver express adgang til min public mappe
app.use(express.urlencoded({ extended: true })); // Giver express adgang til at parse data fra formular
app.set("view engine", "ejs");

//---------------------SAMTALEHISTORIK---------------------//

const messages = [];

//----------------------ROUTES----------------------//

app.get("/", (req, res) => {
  res.render("index", { messages });
});

app.post("/ask", (req, res) => {
  const question = req.body.question;

  messages.push({ type: "question", text: question });
  messages.push({ type: "answer", text: "Jeg leder efter et svar ..." });

  res.render("index", { messages });
});

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
