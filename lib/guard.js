function guard (path, user, options) {
  const routeInfo = options.routes.match(path)

  if (routeInfo.auth === false || routeInfo.scope.find(s => user.scope.includes(s))) {
    return options.grant && options.grant()
  }

  return options.deny()
}

export default guard
