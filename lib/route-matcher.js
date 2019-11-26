class RouteMatcher {
  constructor (router) {
    this.router = router
  }

  match (path) {
    const key = this.router.lookup.find(p => path.match(p))
    return this.router.routes[key]
  }
}

export default RouteMatcher
