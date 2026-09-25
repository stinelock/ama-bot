import express from "express";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";
import cors from "cors"

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//
app.use(express.json());
app.use(cors());

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Kunne ikke finde efterspurgte sti." });
});
app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).json({ error: error.message });
});

//----------------------OPSTART AF SERVER----------------------//

app.listen(port, () => {
	console.log(`Server is runnning at http://localhost:${port}`);
});
