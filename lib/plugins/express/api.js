const { Router } = require('express')

const API = require('../../api')

const router = Router()

API.macro('getExpressRoutes', function () {
  this.resolvers.map((resolver) => {
    const method = resolver._methods || 'get'

    router[method](resolver._path, async (req, res) => {
      res.send(await resolver._resolver({ req, res }))
    })
  })

  return router
})

module.exports = API
