const bcrypt = require('bcrypt');

// function to encrypt password
function encrypt(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

// function to decrypt password
function decrypt(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    encrypt,
    decrypt
}