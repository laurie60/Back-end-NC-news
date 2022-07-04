const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
const sorted = require("jest-sorted");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
// afterAll(() => db.end);

// describe.only("Name of the group", () => {
//   test("should ", () => {
//     return db.query("SELECT * FROM topics").then((topics) => {
//       console.log(topics.rows);
//     });
//   });
// });

describe("News Express App", () => {
  describe("get/api/topics", () => {
    test("200: responds with array of objects, each of which have properties slug & description ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
    test("404: responds with a message when non existant endpoint requested ", () => {
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
});
