'use strict';

const basicAuth = require('basic-auth');
const crypto = require('crypto');

/**
 *
 * @param credentials
 * @param options {{hashing_algorithm}}
 * @returns {Function}
 */
module.exports = function (credentials = {}, options = {}) {
  return async (ctx, next) => {
    /**
     * @type {{name, pass}|undefined}
     */
    const user = basicAuth(ctx);

    if (!user) {
      return forbid(ctx);
    }

    if (options.hashing_algorithm) {
      user.pass = crypto.createHash(options.hashing_algorithm)
        .update(user.pass)
        .digest('hex');
    }

    if (credentials[user.name] !== user.pass) {
      return forbid(ctx);
    }

    await next();
  };
}

/**
 *
 * @param ctx
 */
function forbid(ctx) {
  ctx.status = 401;
  ctx.set('WWW-Authenticate', 'Basic');
}
