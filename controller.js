const {
  fetchTopics,
  fetchArticleById,
  alterVotes,
  fetchUsers,
  fetchArticles,
  fetchArticleComments,
  insertComment,
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
    res.status(200).send({ users });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  //console.log(topic, "<<<<<<<<<<<query");
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { articleId } = req.params;
  fetchArticleComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const comment = req.body;
  const { articleId } = req.params;
  insertComment(articleId, comment)
    .then((userComment) => {
      res.status(201).send(userComment);
    })
    .catch(next);
};
