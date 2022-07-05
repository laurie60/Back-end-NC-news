const { fetchTopics, fetchArticleById } = require("./models");

const { req, res } = require("./app");

exports.getTopics = (req, res) => {
  console.log(req.query, "<<<<<<<<<<<<<<<<query");

  fetchTopics().then((responses) => {
    //console.log(treasures.length);
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

exports.updateVotes = (req, res) => {
  console.log(req.body);
  alterVotes(req.body).then((alteredArticle) => {
    res.send(200).send({ alteredArticle }).catch(next);
  });
};
