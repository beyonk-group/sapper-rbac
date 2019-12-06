import { expect } from '@hapi/code'
import { stub } from 'sinon'
import Router from 'router.js'
import guard from 'guard.js'

describe('guard', () => {
  const routes = new Router()
    .unrestrict('/unrestricted/path')
    .restrict('/admins/only', [ 'admin' ])
    .restrict('/vendors/instead', ['vendor'])
    .restrict('/admins/and/vendors', ['vendor', 'admin'])
    .restrict('/no/scope/no/hope', [])
    .restrict('.*', [ 'customer' ])
    .build()

  context('#guard', () => {
    const options = {
      grant: stub(),
      deny: stub(),
      routes
    }

    afterEach(() => {
      options.grant.reset()
      options.deny.reset()
    })

    it('allows access to admin', () => {
      guard('/admins/only', { scope: [ 'admin' ] }, options)
      expect(options.grant.callCount).to.equal(1)
    })

    it('allows access to vendor', () => {
      guard('/vendors/instead', { scope: [ 'vendor' ] }, options)
      expect(options.grant.callCount).to.equal(1)
    })

    it('allows access to admin for multiple scopes', () => {
      guard('/admins/and/vendors', { scope: [ 'admin' ] }, options)
      expect(options.grant.callCount).to.equal(1)
    })

    it('allows access to vendor for multiple scopes', () => {
      guard('/admins/and/vendors', { scope: [ 'vendor' ] }, options)
      expect(options.grant.callCount).to.equal(1)
    })

    it('route with no scope is inaccessible', () => {
      guard('/no/scope/no/hope', { scope: [ 'admin' ] }, options)
      expect(options.deny.callCount).to.equal(1)
    })

    it('user does not have a scope attribute', () => {
      guard('/whatever', {}, options)
      expect(options.deny.callCount).to.equal(1)
    })

    it('user has incorrect scope for any route', () => {
      guard('/whatever', { scope: [] }, options)
      expect(options.deny.callCount).to.equal(1)
    })

    it('disallow vendor', () => {
      guard('/admins/only', { scope: [ 'vendor' ] }, options)
      expect(options.deny.callCount).to.equal(1)
    })

    it('disallow vendor and include path', () => {
      const path = '/admins/only'
      guard(path, { scope: [ 'vendor' ] }, options)
      expect(options.deny.firstCall.args[0]).to.equal(path)
    })

    it('disallow vendor and include scope info', () => {
      guard('/admins/only', { scope: [ 'vendor' ] }, options)
      expect(options.deny.firstCall.args[1]).to.equal({
        given: [ 'vendor' ],
        required: [ 'admin' ]
      })
    })
  })
})
