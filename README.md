<a href="https://beyonk.com">
    <br />
    <br />
    <img src="https://user-images.githubusercontent.com/218949/144224348-1b3a20d5-d68e-4a7a-b6ac-6946f19f4a86.png" width="198" />
    <br />
    <br />
</a>

# RBAC for Sapper

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![build-status](https://img.shields.io/github/workflow/status/beyonk-adventures/sapper-rbac/publish)](https://github.com/beyonk-adventures/sapper-rbac/) [![Svelte v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

Role-based access control for Sapper. Works on both the server-, and, client-side.

# Install

Install as a dev dependency:

```bash
npm install --save-dev @beyonk/sapper-rbac
```

# Usage

## Define a set of route permissions in your application

* For Sapper to work, `/client/.*` is automatically unrestricted.

```js
import { Router } from '@beyonk/sapper-rbac'

const routes = new Router()
  .unrestrict('/login.*')
  .restrict('/admin/sales.*', [ 'admin', 'sales' ])
  .restrict('/admin.*', ['admin'])
  .restrict('.*', [ 'customer' ])
  .build()

export default routes
```

## For the server-side

```js
import { guard } from '@beyonk/sapper-rbac'
import routes from './my-routes.js'

const app = polka()
  .use(
    sessionMiddleware,
    (req, res, next) => {
      const options = {
        routes,
        deny: () => {
          res.writeHead(302, { Location: '/login' })
          return res.end()
        },
        grant: () => {
          return sapper.middleware({
            session: () => (res.user ? { user: res.user } : {})
          })(req, res, next)
        }
      }

      return guard(req.path, res.user, options)
    }
  )

```

### sessionMiddleware

This middleware adds a user object at `res.user` (or null if the request isn't authenticated). The only required attribute of this user is `scope` which contains a list of authentication scopes that the user has:

```js
function sessionMiddleware (req, res, next) {
  res.user = {
    scope: ['admin', 'other']
  }

  next()
}
```

### deny

For cases where the user is denied access, call this function.

The deny function receives two parameters:

```js
deny (path, scope) {
  // path: /some/path - the path the user attempted to access
  // scope: {
  //  given: [ 'sales.view', 'booking.create' ] - the scopes the user has
  //  required: [ 'admin.view' ] - the scopes the user required
  // }
}
```

### grant

For cases where the user is granted access, call this function.

## For the client-side

On the client side, we integrate with the page store in the root `_layout.svelte`:

```js
import routes from './my-routes.js'
import { guard } from '@beyonk/sapper-rbac'
import { tick } from 'svelte'
import { stores, goto } from '@sapper/app'

const { page, session } = stores()

const options = {
  routes,
  deny: () => goto('/login')
  // we don't specify grant here, since we don't need to do anything.
}

// Listen to the page store.
page.subscribe(async v => {
  await tick() // let the previous routing finish first.
  guard(v.path, $session.user, options)
})
```
