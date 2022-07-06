const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("News Express App", () => {
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
    test("404: responds with a message when article ID of invalid number endpoint requested ", () => {
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
    test("200: responds with array containing object of specified article,  ", () => {
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
});
