# koa-basic-auth

```js
const koa = require('koa');
const basicAuth = require('@rainder/koa-basic-auth');

const app = koa();

app.use(basicAuth({
  john: 'smith',
  igor: 'danutov'
}));

```
