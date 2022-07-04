const { fetchTopics } = require("./models");

const { req, res } = require("./app");

exports.getTopics = (req, res) => {
  console.log(req.query, "<<<<<<<<<<<<<<<<query");

  fetchTopics().then((responses) => {
    //console.log(treasures.length);
    res.status(200).send({ topics: responses });
  });
};
