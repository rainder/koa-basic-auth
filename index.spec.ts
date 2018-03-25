import { expect } from 'chai';
import { createHash } from 'crypto';
import * as sinon from 'sinon';
import { KoaBasicAuth } from './index';

describe('middleware', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it('should throw 401 if no header set', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({});
    const ctx = <any>{
      headers: {},
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(1);
    expect(ctx.status).to.equals(401);
  });

  it('should throw 401 if auth header is not basic', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({});
    const ctx = <any>{
      headers: {
        authorization: 'Bearer 123',
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(1);
    expect(ctx.status).to.equals(401);
  });

  it('should throw 401 if auth header contains no token', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({});
    const ctx = <any>{
      headers: {
        authorization: 'Basic',
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(1);
    expect(ctx.status).to.equals(401);
  });

  it('should throw 401 if user is not found', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({});
    const ctx = <any>{
      headers: {
        authorization: `Basic ${new Buffer(`no:no`).toString('base64')}`,
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(1);
    expect(ctx.status).to.equals(401);
  });

  it('should throw 401 if password does not match', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({
      test: createHash('md5').update('test').digest('hex'),
    }, {
      hashingAlgorithm: 'md5',
    });
    const ctx = <any>{
      headers: {
        authorization: `Basic ${new Buffer(`test:no`).toString('base64')}`,
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(1);
    expect(ctx.status).to.equals(401);
  });

  it('should pass auth', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({
      test: 'test',
    });
    const ctx = <any>{
      headers: {
        authorization: `Basic ${new Buffer(`test:test`).toString('base64')}`,
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(0);
    expect(next.callCount).to.equals(1);
  });

  it('should pass auth (md5)', async () => {
    const next = sandbox.spy();
    const setHeaders = sandbox.spy();
    const middleware = KoaBasicAuth.middleware({
      test: createHash('md5').update('test').digest('hex'),
    }, {
      hashingAlgorithm: 'md5',
    });
    const ctx = <any>{
      headers: {
        authorization: `Basic ${new Buffer(`test:test`).toString('base64')}`,
      },
      set: setHeaders,
    };

    await middleware(ctx, next);

    expect(setHeaders.callCount).to.equals(0);
    expect(next.callCount).to.equals(1);
  });
});
