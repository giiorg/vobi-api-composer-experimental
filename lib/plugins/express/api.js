const { Router } = require('express')
const API = require('../../api')
const { loadResolverFunc } = require('../../helpers')

const router = Router()

API.macro('getExpressRoutes', function () {
  this._resolvers.map((resolver) => {
    let method
    if (Array.isArray(resolver._methods) && resolver._methods.length > 0) {
      if (resolver._methods.length === 1) {
        method = resolver._methods[0]
      } else {
        method = 'all'
      }
    } else {
      method = 'get'
    }

    router[method](resolver._path, async (req, res) => {
      let resolverFunc
      if (typeof resolver._resolver === 'function') {
        resolverFunc = resolver._resolver
      } else {
        resolverFunc = loadResolverFunc(resolver)
      }
      res.send(await resolverFunc({ req, res }))
    })
  })

  return router
})

module.exports = API
