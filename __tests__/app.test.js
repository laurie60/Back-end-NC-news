const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
const sorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end);

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
          console.log(body.article, "<<<<body.article in test");
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
  // describe("PATCH /api/articles/:article_id", () => {
  //   test("Should alter votes of secified article by given amount", () => {
  //     const changeVotes = { inc_votes: -100 };
  //     return request(app)
  //       .patch("/api/articles/1")
  //       .send(changeVotes)
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body.article).toEqual(
  //           expect.objectContaining({
  //             title: "Living in the shadow of a great man",
  //             topic: "mitch",
  //             author: "butter_bridge",
  //             body: "I find this existence challenging",
  //             votes: 0,
  //             article_id: 1,
  //           })
  //         );
  //       });
  //   });
  // });
});
