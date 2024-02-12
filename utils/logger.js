const fs = require("fs");
const path = require("path");
const { errorLog, warningLog, successLog, separateLine, infoLog } = require("../utils/chalk.log");

const logger = async function (req, res, next) {

  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) {
      const currentDate = new Date().toISOString().split("T")[0];
      const logFilename = path.join(__dirname, "/../logs", `${currentDate}.log`);

      const logEntry = `Date: ${new Date().toISOString()}, Request: ${
        req.method
      } - ${req.originalUrl}, Status Code: ${
        res.statusCode
      }, Error Message: ${data}\n`;

      fs.appendFile(logFilename, logEntry, (err) => {
        if (err) {
          errorLog("Error writing to log file", err);
        }
      });
    }

    originalSend.apply(this, arguments);
  };

  next();
};

function fileSystemCheck(){
  separateLine()
  infoLog("Checking log file system");
  if (!fs.existsSync(`${__dirname}/../logs`)) {
    warningLog("Creating logs directory");
    fs.mkdirSync(`${__dirname}/../logs`);
  }
  successLog("Checking file system complete successful");
}
module.exports = { logger, fileSystemCheck };
