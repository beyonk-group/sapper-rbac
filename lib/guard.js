function guard (path, user, options) {
  const routeInfo = options.routes.match(path)
  const given = user.scope || []
  const required = routeInfo.scope

  if (routeInfo.auth === false || required.find(s => given.includes(s))) {
    return options.grant && options.grant()
  }

  return options.deny(path, { given, required })
}

export default guard
