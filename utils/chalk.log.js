const chalk = require("chalk");

const errorLog = function (message, log) {
  return console.log(chalk.bold.red(message, log));
};

const warningLog = function (message, log) {
  return console.log(chalk.hex("#FFA500")(message, log));
};

const successLog = function (message, log) {
  return console.log(chalk.green(message, log));
};

const infoLog = function (message, log) {
  return console.log(chalk.blue(message, log));
};

const separateLine = function() {
  return console.log(chalk.white("----------------------------------------"));
}

module.exports = { errorLog, warningLog, successLog, infoLog, separateLine };
