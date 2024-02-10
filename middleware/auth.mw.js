const jwt = require("jsonwebtoken");
const {
  errorLog,
  warningLog,
  successLog,
  infoLog,
  separateLine
} = require("../utils/chalk.log");

function authorize(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access denied, no token provide");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SIGNATURE);
    req.user = payload;
    next();
  } catch (err) {
    separateLine()
    warningLog("Token verification error:", err);
    res.status(400).send("Invalid token.");
  }
}

module.exports = {
  authorize,
};
