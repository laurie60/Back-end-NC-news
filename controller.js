const {
  fetchTopics,
  fetchArticleById,
  alterVotes,
  fetchUsers,
} = require("./models");

const { req, res } = require("./app");

exports.getTopics = (req, res) => {
  fetchTopics().then((responses) => {
    res.status(200).send({ topics: responses });
  });
};

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { articleId } = req.params;

  if (!req.body.inc_votes && req.body.inc_votes !== 0) {
    next({ msg: "invalid input type" });
  } else {
    alterVotes(articleId, inc_votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    console.log(users, "Users in Controllers");
    res.status(200).send({ users });
  });
};
