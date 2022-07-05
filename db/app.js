const express = require("express");
const { getTopics, getArticleById, getUsers } = require("./controller");
const { getTopics, getArticleById, updateVotes } = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticleById);

app.patch("/api/articles/:articleId", updateVotes);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  // handle custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.msg === "invalid input type") {
    res.status(400).send({ msg: "invalid input type" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Servers Error" });
});

app.use("*", (request, response) => {
  console.log("404");
  response.status(404).send({ message: "404: endpoint does not exist" });
});

module.exports = app;
