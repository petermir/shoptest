const expressSession = require("express-session");
const mongoDbStore = require('connect-mongodb-session')

let mongodbUrl = 'mongodb://127.0.0.1:27017'
if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL
}

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);
  const store = new MongoDBStore({
    uri: mongodbUrl,
    databaseName: "online-shop",
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
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    },
  };
}

module.exports = createSessionConfig;