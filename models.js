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

  return commentCountArr.rows;
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

  return commentCountArr.rows;
};

exports.fetchArticleComments = async (articleId) => {
  const articleCheck = await db.query(
    `SELECT * FROM articles where article_id = $1;`,
    [articleId]
  );
  if (articleCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found with article ID: ${articleId}`,
    });
  }

  const articleComments = await db.query(
    `SELECT comments.comment_id, comments.article_id, comments.votes, comments.created_at, comments.author, comments.body
FROM comments
LEFT JOIN articles 
ON articles.article_id = comments.article_id 
WHERE articles.article_id = $1;`,
    [articleId]
  );

  return articleComments.rows;
};

exports.insertComment = async (articleId, comment) => {
  const username = Object.keys(comment)[0];
  const commentBody = comment[username];
  const articleCheck = await db.query(
    `SELECT * FROM articles where article_id = $1;`,
    [articleId]
  );
  if (articleCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found with article ID: ${articleId}`,
    });
  }
  const UserCheck = await db.query(`SELECT * FROM users where username = $1;`, [
    username,
  ]);
  if (UserCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `No user found with username: ${username}`,
    });
  }

  const postComment = await db.query(
    `INSERT INTO comments ( article_id, votes, created_at, author, body ) VALUES ($1, 0, now(), $2, $3) RETURNING body;`,
    [articleId, username, commentBody]
  );

  return postComment.rows[0];
};
