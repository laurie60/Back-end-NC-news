const db = require("./db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [articleId])

    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found with article ID: ${articleId}`,
        });
      }
      return article;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    console.log(rows, "<<<<in models");
    return rows;
  });
};

//exports.alterVotes();
exports.alterVotes = (articleId, inc_votes) => {
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
  const variables = [inc_votes, articleId];
  console.log(variables);
  return db.query(queryStr, variables).then(({ rows }) => {
    const article = rows[0];
    return article;
  });
};
