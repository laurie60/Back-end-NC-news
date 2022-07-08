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

exports.fetchArticles = async (sort_by, order, topic) => {
  let queryStr = `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY created_at DESC;`;
  const columnNames = [
    "comment_count",
    "votes",
    "created_at",
    "body",
    "author",
    "topic",
    "title",
    "article_id",
  ];
  const queryValues = [];

  if (sort_by) {
    if (!columnNames.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: `${sort_by} is not a valid sort option`,
      });
    }
    queryStr = `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY ${sort_by} DESC;`;
  }

  if (order) {
    if (order !== "ASC" && order !== "DESC") {
      return Promise.reject({
        status: 400,
        msg: `${order} is not a valid order option`,
      });
    }
    if (order === "ASC") {
      queryStr = `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY created_at ASC;`;
    }
  }

  if (topic) {
    const { rows } = await db.query("SELECT * FROM topics;");
    if (rows.filter((topics) => topics.slug === topic).length === 0) {
      return Promise.reject({
        status: 400,
        msg: `${topic} is not a valid topic`,
      });
    }
    queryStr = `SELECT articles.*, COUNT(comments.article_id) 
::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
WHERE articles.topic = $1
GROUP BY articles.article_id
ORDER BY created_at DESC;`;
    queryValues.push(topic);
  }

  const articlesArr = await db.query(queryStr, queryValues);

  return articlesArr.rows;
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
  const username = comment.username;
  const commentBody = comment.body;

  if (!username || !commentBody) {
    return Promise.reject({
      status: 400,
      msg: `Please provide username and comment`,
    });
  }

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

exports.removeComment = async (commentId) => {
  const commentCheck = await db.query(
    `SELECT * FROM comments where comment_id = $1;`,
    [commentId]
  );
  if (commentCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `No comment found with comment id: ${commentId}`,
    });
  }

  const deleted = await db.query(
    "DELETE FROM comments WHERE comment_id=$1 RETURNING *;",
    [commentId]
  );

  return;
};
