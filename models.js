const db = require("./db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = async (articleId) => {
  const articleArr = await db.query(
    `SELECT * FROM articles WHERE article_id=$1;`,
    [articleId]
  );

  const article = articleArr.rows[0];

  const commentCountArr = await db.query(
    `SELECT COUNT(comments) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1;`,
    [articleId]
  );

  const count = commentCountArr.rows[0];

  if (!article) {
    return Promise.reject({
      status: 404,
      msg: `No article found with article ID: ${articleId}`,
    });
  }

  const articleCount = { ...count, ...article };

  return articleCount;
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

//exports.alterVotes();
exports.alterVotes = (articleId, inc_votes) => {
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
  const variables = [inc_votes, articleId];
  return db.query(queryStr, variables).then(({ rows }) => {
    const article = rows[0];
    return article;
  });
};
