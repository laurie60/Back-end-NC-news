const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe(" GET endpoints News Express App", () => {
  describe("GET api/topics", () => {
    test("200: responds with array of objects, each of which have properties slug & description ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
    test("404: responds with a message when article ID of invalid endpoint requested ", () => {
      return request(app)
        .get("/ipa")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            message: "404: endpoint does not exist",
          });
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("200: responds with array containing object of specified article, and the number of comments that are associated with the article id  ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              votes: 100,
              article_id: 1,
              comment_count: 11,
            })
          );
        });
    });

    test("404: responds with a message when non-existant article id is requested ", () => {
      return request(app)
        .get("/api/articles/3000")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "No article found with article ID: 3000",
          });
        });
    });

    test("400: responds with appropriate message when non integer article ID is requested  ", () => {
      return request(app)
        .get("/api/articles/potato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "invalid input type",
          });
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("Should alter votes of secified article by given amount", () => {
      const changeVotes = { inc_votes: -100 };
      return request(app)
        .patch("/api/articles/1")
        .send(changeVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              votes: 0,
              article_id: 1,
            })
          );
        });
    });
    test("Should not alter votes of secified article if inc_votes is given value 0", () => {
      const changeVotes = { inc_votes: 0 };
      return request(app)
        .patch("/api/articles/1")
        .send(changeVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              votes: 100,
              article_id: 1,
            })
          );
        });
    });

    test("if no inc votes is given on the request body, throw error", () => {
      const changeVotes = {};
      return request(app)
        .patch("/api/articles/1")
        .send(changeVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "invalid input type",
          });
        });
    });
    test("400: responds with appropriate message when non integer value of inc_votes is given ", () => {
      const changeVotes = { inc_votes: "potato" };
      return request(app)
        .patch("/api/articles/1")
        .send(changeVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "invalid input type",
          });
        });
    });
    test("400: responds with appropriate message when no there is no inc_votes key in the request parameter", () => {
      const changeVotes = { zinc_votes: 80 };
      return request(app)
        .patch("/api/articles/1")
        .send(changeVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "invalid input type",
          });
        });
    });
  });

  describe("GET api/users", () => {
    test("200: responds with array of user objects, each of which have URL, username and name properties ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
    test("404: responds with a message when article ID of invalid number endpoint requested ", () => {
      return request(app)
        .get("/api/userz")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            message: "404: endpoint does not exist",
          });
        });
    });
  });
  describe("GET api/articles", () => {
    test("200: responds with array of article objects, each of which have author, title, article_id, topic, created_at, votes, comment_count, sorted by the date created (descending)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("200: responds with array of article objects, each of which have author, title, article_id, topic, created_at, votes, comment_count, sorted by a permitted sorted_by query (descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });

    test("400: responds with error message if invalid sort query is attempted", () => {
      return request(app)
        .get("/api/articles?sort_by=potato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "potato is not a valid sort option" });
        });
    });

    test.only("200: responds with array of article objects, sorted by the date created in ascending ascending if order ascending query is requested", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at"); //ascending is default in jestSorted
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test.only("400: responds with error message if invalid order query is attempted", () => {
      return request(app)
        .get("/api/articles?order=potato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "potato is not a valid order option" });
        });
    });

    test.only("200: responds with array of article objects of specified topic if valid topic is requested ", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(body.articles).toHaveLength(11);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test.only("400: responds with error message if invalid order query is attempted", () => {
      return request(app)
        .get("/api/articles?topic=potato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "potato is not a valid topic",
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with array of comment objects, each of which have comment_id, votes, created_at, author, article_id and body properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          console.log(body.comments, "<<<<<<in test");

          expect(body.comments).toHaveLength(11);
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment.article_id).toBe(1);
          });
        });
    });
    test("Returns 404 if there is no article_id corresponding to the one requested", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "No article found with article ID: 1000",
          });
        });
    });
    test("Returns 200 with empty comments array if passed an article ID which has no comments associated with it", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("Returns 400 with appropriate message if passed article id of invalid type", () => {
      return request(app)
        .get("/api/articles/bannans/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "invalid input type",
          });
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201:  object of the posted", () => {
      const comment = { icellusedkars: "Wagon Wheels" };

      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({ body: "Wagon Wheels" });
        });
    });
    test("404: when an article id is requested that does not exist, responds with a 404 error and an appropriate message", () => {
      const comment = { icellusedkars: "Wagon Wheels" };

      return request(app)
        .post("/api/articles/188/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "No article found with article ID: 188",
          });
        });
    });
    test("404: when comment is posted with author whose username is not in the users table, responds with an appropriate error message ", () => {
      const comment = { questioningmyexistance: "Wagon Wheels" };

      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: `No user found with username: questioningmyexistance`,
          });
        });
    });

    test("400: if invalid id of invalid type is requested, responds with appropriate message ", () => {
      const comment = { questioningmyexistance: "Wagon Wheels" };

      return request(app)
        .post("/api/articles/potato/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: `invalid input type`,
          });
        });
    });
  });
});

// prettier-ignore
describe("DELETE /api/comments/:comment_id", () => {
  test("204:  object of the posted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});
