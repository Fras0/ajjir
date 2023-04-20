const expressSession = require('express-session');
const mongoDbstore = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDBStore = mongoDbstore(expressSession);

  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "ajjir",
    collection: "sessions",
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
