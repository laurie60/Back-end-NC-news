const db = require("./connection");

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
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
