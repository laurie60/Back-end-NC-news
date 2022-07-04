const express = require("express");
const { getTopics } = require("./controller");

const app = express();

//app.use(express.json());

//console.log(getTopics);

app.get("/api/topics", getTopics);

app.use("*", (request, response) => {
  console.log("404");
  response.status(404).send({ message: "404: endpoint does not exist" });
});

module.exports = app;
