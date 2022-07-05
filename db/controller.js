const { fetchTopics, fetchArticleById, alterVotes } = require("./models");

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
  console.log(req.body);
  //console.log(!req.body.inc_votes, "<<<<<<<<!req.body.inc_votes");

  if (!req.body.inc_votes) {
    next({ msg: "invalid input type" });
  } else {
    const { inc_votes } = req.body;
    const { articleId } = req.params;

    alterVotes(articleId, inc_votes)
      .then((alteredArticle) => {
        res.status(200).send({ alteredArticle });
      })
      .catch(next);
  }
};
