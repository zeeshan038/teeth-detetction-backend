//NPM Packages
const jwt = require("jsonwebtoken");

//genrating token
const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = genrateToken;
