const { Router } = require('express')
const API = require('../../api')
const { loadResolverFunc } = require('../../helpers')

const router = Router()

const normalizePath = 
  p => 
    p.charAt(0) === '/' 
      ? p 
      : `/${p}`

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

    let resolverFunc
    if (typeof resolver._resolver === 'function') {
      resolverFunc = resolver._resolver
    } else {
      resolverFunc = loadResolverFunc(resolver)
    }

    router[method](normalizePath(resolver._path), async (req, res) => {
      let args = {}
      if (req.params) {
        args = {
          ...req.params
        }
      }
      if (req.query) {
        args.filter = req.query
      }
      if (req.body) {
        args.record = req.body
      }

      // if (
      //   r._policies.length > 0 ||
      //   r._beforeMiddlewares.length > 0 ||
      //   r._afterMiddlewares.length > 0
      // ) {
      //   const pathsToFunctions =
      //     (paths, resolver, isPolicy = false) =>
      //       paths.map(
      //         funcPath => loadResolverHook(funcPath, resolver, isPolicy)
      //       )
  
      //   const middlewarePathsToFunctions =
      //     (middlewares, resolver) => {
      //       return middlewares.map(
      //         middleware => ({
      //           exec: middleware.exec,
      //           actions: pathsToFunctions(middleware.actions, resolver, !!middleware.isPolicy)
      //         })
      //       )
      //     }
  
      //   let befores = []
      //   if (r._policies.length > 0) {
      //     befores = [...r._policies]
      //   }
        
      //   if (r._beforeMiddlewares.length > 0) {
      //     befores = [
      //       ...befores,
      //       ...r._beforeMiddlewares
      //     ]
      //   }

      //   if (befores.length > 0) {
      //     const beforeMiddlewares = middlewarePathsToFunctions(befores, resolver)
      //   }

      //   if (r._afterMiddlewares.length > 0) {

      //   }
      // }

      const result = await resolverFunc({
        source: undefined,
        args,
        context: { req },
        info: undefined,
      })

      res.send(result)
    })
  })

  return router
})

module.exports = API
