'use strict';

import { createHash } from 'crypto';
import { Context } from 'koa';

export namespace KoaBasicAuth {
  export interface Credentials {
    [user: string]: string;
  }

  export interface Options {
    hashingAlgorithm: string;
  }

  export function middleware(credentials: Credentials, options?: Options) {
    return async (ctx: Context, next: Function) => {
      const headerValue = ctx.headers['authorization'];

      if (!headerValue) {
        return forbid(ctx);
      }

      const [type, value] = headerValue.split(' ');

      if (type.toLowerCase() !== 'basic' || !value) {
        return forbid(ctx);
      }

      const [user, pass] = new Buffer(value, 'base64').toString().split(':');

      if (!user || !pass || !credentials[user]) {
        return forbid(ctx);
      }

      const hashedPassword = options && options.hashingAlgorithm
        ? createHash(options.hashingAlgorithm)
          .update(pass)
          .digest('hex')
        : pass;


      if (hashedPassword !== credentials[user]) {
        return forbid(ctx);
      }

      return next();
    };
  }

  /**
   *
   * @param ctx
   */
  function forbid(ctx: Context) {
    ctx.set('WWW-Authenticate', 'Basic');
    ctx.status = 401;
  }

}
