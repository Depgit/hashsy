const crypto = require('crypto');

function uuid() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = uuid