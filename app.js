const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
  getUsers,
  getArticles,
  getArticleComments,
  postComment,
  deleteComment,
} = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticleById);

app.patch("/api/articles/:articleId", updateVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:articleId/comments", getArticleComments);

app.post("/api/articles/:articleId/comments", postComment);

app.delete("/delete/comment/:comment_id", deleteComment);

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
  res.status(500).send({ msg: "Internal Servers Error" });
});

app.use("*", (request, response) => {
  response.status(404).send({ message: "404: endpoint does not exist" });
});

module.exports = app;
