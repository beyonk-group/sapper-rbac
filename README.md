# Experimental RBAC for Sapper

A work in progress.

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
