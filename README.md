# NC-news's Back-End

API hosted on Cyclic:
[be-news.cyclic.app](https://be-news.cyclic.app)

Click here for a list of endpoints and methods:
[be-news.cyclic.app/api](https://be-news.cyclic.app/api)

This repo contains an API for NC-news, a news site.
The repo sets up and seeds a database containing information on:

- Users
- Articles
- Topics
- Comments

The API responds to different endpoints ([listed here](https://be-news.cyclic.app/api)) which variously Get, Patch, Post and Delete the information in the database.

## Getting Started

- Fork or clone this directory

- Install dependencies with:

```
npm i
```

This project was made with Node version 18.12.1 and PostgreSQL version 14.5

Database Set Up

Add a `.development.env` file which contains the following:

```
  username: 'YOUR_POSTGRES_USERNAME',
  password: 'YOUR_POSTGRES_PASSWORD'
```

If you are on mac, the password variable is not required. The `.development.env` will be `.gitigored` automatically.

No we are ready to start and seed the database using the following commands:

```
npm run setup-dbs && npm run seed
```

## Testing

All of the endpoints of the API have one or multiple methods, and each method has a number of tests which test for a successful response given a valid request and error-handling for invalid requests.

To run tests use:

```
npm test
```
