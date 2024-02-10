const { mongo } = require("../configs/config");
const mongoose = require("mongoose");
const { errorLog, warningLog, successLog, infoLog, separateLine } = require("../utils/chalk.log")

async function connect() {
  const url = `${mongo.url}${mongo.url.at(-1) === "/" ? "" : "/"}${
    mongo.dbName
  }`;
  separateLine()
  infoLog(`Connecting to db: ${url}`);

  return mongoose
    .connect(url)
    .then(() => successLog("Connected to db"))
    .catch((err) =>
      errorLog("Could not connect to db", err.message)
    );
}

module.exports = { connect };
