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
  john: 'a66e44736e753d4533746ced572ca821',
  igor: 'e98ef4146865a8ccaca773182be30990'
}, {
  hashing_algorithm: 'md5',
}));

```
