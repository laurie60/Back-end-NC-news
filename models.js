const db = require("./db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = async (articleId) => {
  const commentCountArr = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
WHERE articles.article_id = $1 
GROUP BY articles.article_id;`,
    [articleId]
  );

  const articleCount = commentCountArr.rows[0];

  if (!articleCount) {
    return Promise.reject({
      status: 404,
      msg: `No article found with article ID: ${articleId}`,
    });
  }

  return articleCount;
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.alterVotes = (articleId, inc_votes) => {
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
  const variables = [inc_votes, articleId];
  return db.query(queryStr, variables).then(({ rows }) => {
    const article = rows[0];
    return article;
  });
};

exports.fetchArticles = async () => {
  const commentCountArr = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY created_at DESC;`
  );

  console.log(commentCountArr.rows, "<<<<<<< in models");

  // const articleCount = commentCountArr.rows[0];

  // if (!articleCount) {
  //   return Promise.reject({
  //     status: 404,
  //     msg: `No article found with article ID: ${articleId}`,
  //   });
  // }

  return commentCountArr.rows;
};
