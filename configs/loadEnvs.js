const path = require("node:path");
const { infoLog } = require("../utils/chalk.log")

const envPath = path.resolve(__dirname, `../${`.env.${process.env.NODE_ENV}`}`);

infoLog("loading environment variables from: ", envPath);

require("dotenv").config({
  path: envPath,
});
