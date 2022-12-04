const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV) {
  console.log(ENV, process.env.DATABASE_URL);
} else console.log("no env");

if (process.env.DATABASE_URL) {
  console.log(process.env.DATABASE_URL);
} else console.log("no url");

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        dialect: "postgres",
      }
    : {};

module.exports = new Pool(config);
