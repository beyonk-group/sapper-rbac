import RouteMatcher from './route-matcher.js'

class Router {
  constructor () {
    this.lookup = []
    this.routes = {}
    this.unrestrict('/client/.*')
  }

  addMapping (path, options) {
    const matcher = new RegExp(path)
    this.routes[matcher] = Object.assign({ path }, options)
    this.lookup.push(matcher)
  }

  restrict (path, scope) {
    this.addMapping(path, { scope })
    return this
  }

  unrestrict (path) {
    this.addMapping(path, { auth: false })
    return this
  }

  build () {
    return new RouteMatcher(this)
  }
}

export default Router
