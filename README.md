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

## Support for password hashing algorithm 

```js
app.use(basicAuth({
  john: 'smith',
  igor: 'e98ef4146865a8ccaca773182be30990'
}, {
  hashing_algorithm: 'md5',
}));

```
