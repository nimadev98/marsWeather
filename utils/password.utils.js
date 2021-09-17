const crypto = require("crypto");

function genPass(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    hash,
    salt,
  };
}

function validatePass(password, hash, salt) {
  const pass = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return pass === hash;
}

module.exports = {
  genPass,
  validatePass,
};
