const fs = require("fs");
const path = require("path");
const { errorLog } = require("../utils/chalk.log");

const logger = function (req, res, next) {
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) {
      const currentDate = new Date().toISOString().split("T")[0];
      const logFilename = path.join(__dirname, "../logs", `${currentDate}.log`);
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

module.exports = { logger };
