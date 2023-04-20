const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("ajjir");
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
