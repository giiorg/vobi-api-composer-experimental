const { Router } = require('express')

const API = require('../../api')

const router = Router()

API.macro('getExpressRoutes', function () {
  this._resolvers.map((resolver) => {
    let method
    if (Array.isArray(resolver._methods) && resolver._methods.length > 0) {
      if (method.length === 1) {
        method = resolver._methods[0]
      } else {
        method = 'all'
      }
    } else {
      method = 'get'
    }

    router[method](resolver._path, async (req, res) => {
      res.send(await resolver._resolver({ req, res }))
    })
  })

  return router
})

module.exports = API
