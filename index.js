'use strict';

const basicAuth = require('basic-auth');

module.exports = function (credentials = {}) {
  return function *(next) {
    const user = basicAuth(this);

    if (
      user &&
      user.name in credentials &&
      credentials[user.name] === user.pass
    ) {
      return yield next;
    }

    this.throw(401);
  };
}
