'use strict';

const basicAuth = require('basic-auth');
const crypto = require('crypto');

module.exports = function (credentials = {}, options = {}) {
  return function *(next) {
    const user = basicAuth(this);

    if (options.hash) {
      user.pass = crypto.createHash(options.hash).update(user.pass).digest('hex');
    }

    if (
      user &&
      user.name in credentials &&
      credentials[user.name] === user.pass
    ) {
      return yield next;
    }

    this.status = 401;
    this.set('WWW-Authenticate', 'Basic');
  };
}
