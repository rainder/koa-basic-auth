'use strict';

const chai = require('chai');
const sinon = require('sinon');
const lib = require('./..');

chai.should();

describe('all-tests', function () {
  const credentials = {
    test: 'test',
    test2: '098f6bcd4621d373cade4e832627b4f6',
  };

  const createCtx = (creds) => {
    const headers1 = {};
    const headers2 = {};

    if (creds) {
      const basic = new Buffer(creds).toString('base64');

      headers1['authorization'] = `Basic ${basic}`;
    }

    return {
      req: { headers: headers1 },
      res: { headers: headers2 },
      set: (a, b) => headers2[a] = b,
      status: 200,
    };
  };

  it('should not pass 1', async function () {
    const next = sinon.spy();
    const ctx = createCtx();

    await lib(credentials)(ctx, next);

    next.called.should.equals(false);
    ctx.status.should.equals(401);
  });

  it('should pass', async function () {
    const next = sinon.spy();
    const ctx = createCtx('test:test');

    await lib(credentials)(ctx, next);

    next.called.should.equals(true);
    ctx.status.should.equals(200);
  });

  it('should pass 2', async function () {
    const next = sinon.spy();
    const ctx = createCtx('test2:test');

    await lib(credentials, {
      hashing_algorithm: 'md5',
    })(ctx, next);

    next.called.should.equals(true);
    ctx.status.should.equals(200);
  });

  it('should not pass 2', async function () {
    const next = sinon.spy();
    const ctx = createCtx('test:test2');

    await lib(credentials)(ctx, next);

    next.called.should.equals(false);
    ctx.status.should.equals(401);
  });

  it('should not pass 3', async function () {
    const next = sinon.spy();
    const ctx = createCtx('test:test2');

    await lib({})(ctx, next);

    next.called.should.equals(false);
    ctx.status.should.equals(401);
  });

  it('should not pass 4', async function () {
    const next = sinon.spy();
    const ctx = createCtx();

    await lib()(ctx, next);

    next.called.should.equals(false);
    ctx.status.should.equals(401);
  });
});
