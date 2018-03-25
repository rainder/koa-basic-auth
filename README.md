# koa-basic-auth

```typescript
import * as Koa from 'koa';
import { KoaBasicAuth } from '@rainder/koa-basic-auth';

const app = new Koa();

app.use(KoaBasicAuth.middleware({
  john: 'smith',
  igor: 'danutov'
}));

```

## Support for password hashing algorithm 

```typescript
import { KoaBasicAuth } from '@rainder/koa-basic-auth';

app.use(KoaBasicAuth.middleware({
  john: 'a66e44736e753d4533746ced572ca821',
  igor: 'e98ef4146865a8ccaca773182be30990'
}, {
  hashingAlgorithm: 'md5',
}));

```
