import express from "express";

const app = express();
const port = 8000;

//----------------------MIDDLEWARE----------------------//

app.use(express.static("public")); // Giver express adgang til min public mappe
app.set("view engine", "ejs");

//----------------------ROUTES----------------------//

app.get("/", (req,res)=>{
    res.render("index");
})






//----------------------OPSTART AF SERVER----------------------//

app.listen(port, ()=> {console.log(`Server is runnning at http://localhost:${port}`);
})