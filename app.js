require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { router, verifyToken } = require("./routes/auth");

const BookController = require("./controllers/bookController");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/books", verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, authData) => {
        if(err) {
          res.status(403).json({"error": err});
        } else {
            const books = await BookController.seeAllBooks();
            res.status(200).json({books: books, user: authData});
        }
      });
});

app.delete("books/:title", async (req, res) => {
    await BookController.deleteBook(req.params.title);
    res.redirect(301, "/");
});

app.post("books", async (req, res) => {
    try {
        let response = await BookController.addBook(req.body);

        res.send(200).json({status: "books added successfully"});
    }catch(err) {
        res.status(401).json({error: "Error in adding book"});
    }
})

app.use("/auth", router);

app.all(/.*/, (req, res) => {
    res.statusCode = 404;
    res.send("Page not Found");
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
