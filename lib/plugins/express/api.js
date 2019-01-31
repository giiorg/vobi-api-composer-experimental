const { Router } = require('express')
const ApiResponse = require('../../api-response')
const API = require('../../api')
const { loadResolverFunc, middlewarePathsToFunctions, prepareResolvers } = require('../../helpers')
const { normalizePath, guessMethod, prepareArgs } = require('./helpers')

const router = Router()

const runAsyncBeforeMiddlewares =
  (middlewares, rp) => {
    middlewares.forEach(middleware => {
      middleware(rp)
    })
  }

const runSyncBeforeMiddlewares =
  (middlewares, rp) => {
    return Promise
      .all(middlewares.map(pre => pre(rp)))
      .then(() => {})
  }
  
const runAsyncMiddlewares =
  (middlewares, rp) => {
    middlewares.forEach(middleware => {
      middleware(rp)
    })
  }

const flattenAsyncMiddlewares = 
  middlewaresArrays =>
    middlewaresArrays
      .reduce(
        (flatten, step) =>
          [...flatten, ...step ]
        , 
        []
      )
  
   
const runSyncAfterMiddlewares =
  (middlewares, rp) => {
    return Promise
      .all(middlewares.map(pre => pre(rp)))
      .then(r => r)
  }

const promisifyMiddlewares =
  middlewares =>
    rp => 
      Promise.all(
        middlewares.map(m => m(rp))
      )


const promisifyBeforeMiddlewares =
  (middlewarePromises, rp) =>
    Promise.all(
      middlewarePromises.map(
        step => promisifyMiddlewares(step.actions)(rp)
      )
    )

API.macro('getExpressRoutes', function () {
  prepareResolvers(this._resolvers)
    .forEach(resolver => {
      const method = guessMethod(resolver._methods)
      const path = normalizePath(resolver._path)

      router[method](path, async (req, res) => {
        try {
          const rp = {
            source: undefined,
            args: prepareArgs(req),
            context: {
              user: req.user,
            },
            info: undefined,
          }
          
          if (resolver._beforeMiddlewares && resolver._beforeMiddlewares.length > 0) {
            const beforeSyncs = []
            resolver._beforeMiddlewares.forEach(middlewaresGroup => {
              switch (middlewaresGroup.exec) {
                case 'sync':
                  middlewaresGroup.actions.forEach(middleware => {
                    beforeSyncs.push(middleware(rp))
                  })
                  break
                case 'async':
                  middlewaresGroup.actions.forEach(middleware => {
                    middleware(rp)
                  })
                  break
                default:
              }
            })
            if (beforeSyncs.length > 0) {
              Promise.resolve(Promise.all(beforeSyncs))
            }
          }

          const payload = await resolver._resolve(rp)

          rp.context.payload = payload

          if (resolver._afterMiddlewares && resolver._afterMiddlewares.length > 0) {
            const aftersSyncs = []
            resolver._afterMiddlewares.forEach(middlewaresGroup => {
              switch (middlewaresGroup.exec) {
                case 'sync':
                  middlewaresGroup.actions.forEach(middleware => {
                    aftersSyncs.push(middleware(rp))
                  })
                  break
                case 'async':
                  middlewaresGroup.actions.forEach(middleware => {
                    middleware(rp)
                  })
                  break
                default:
              }
            })
            if (aftersSyncs.length > 0) {
              Promise.resolve(Promise.all(aftersSyncs))
            }
          }

          if (rp.context.payload instanceof ApiResponse) {
            if (rp.context.payload.statusCode) {
              res.status(rp.context.payload.statusCode)
            }
            res.send(rp.context.payload.payload)
          } else {
            res.send(rp.context.payload)
          }

          // await promisifyBeforeMiddlewares(
          //   resolver._beforeMiddlewares.filter(step => step.exec === 'sync'),
          //   rp
          // )

          // resolver._beforeMiddlewares.forEach(step => {
          //   console.log(step)
          //   if (step.exec === 'async') {
          //     runAsyncBeforeMiddlewares(step.actions, rp)
          //   }
          //   if (step.exec === 'sync') {
          //     runSyncBeforeMiddlewares(step.actions, rp)
          //   }
          // })

          // const payload = await resolver._resolve(rp)

          // rp.context.payload = payload

          // resolver._afterMiddlewares.forEach(step => {
          //   console.log(step)
          //   if (step.exec === 'async') {
          //     runAsyncAfterMiddlewares(step.actions, rp)
          //   }
          //   if (step.exec === 'sync') {
          //     runSyncAfterMiddlewares(step.actions, rp)
          //   }
          // })

          // res.send(payload)
        } catch (e) {
          res.send(e)
        }
      })
    })
  // this._resolvers.map((resolver) => {
  //   let method
  //   if (Array.isArray(resolver._methods) && resolver._methods.length > 0) {
  //     if (resolver._methods.length === 1) {
  //       method = resolver._methods[0]
  //     } else {
  //       method = 'all'
  //     }
  //   } else {
  //     method = 'get'
  //   }

  //   let resolverFunc
  //   if (typeof resolver._resolve === 'function') {
  //     resolverFunc = resolver._resolve
  //   } else {
  //     resolverFunc = loadResolverFunc(resolver)
  //   }

  //   router[method](normalizePath(resolver._path), async (req, res) => {
  //     let args = {}
  //     if (req.params) {
  //       args = {
  //         ...req.params
  //       }
  //     }
  //     if (req.query) {
  //       args.filter = req.query
  //     }
  //     if (req.body) {
  //       args.record = req.body
  //     }

  //     // if (
  //     //   r._policies.length > 0 ||
  //     //   r._beforeMiddlewares.length > 0 ||
  //     //   r._afterMiddlewares.length > 0
  //     // ) {
  //     //   let befores = []
  //     //   if (r._policies.length > 0) {
  //     //     befores = [...r._policies]
  //     //   }
        
  //     //   if (r._beforeMiddlewares.length > 0) {
  //     //     befores = [
  //     //       ...befores,
  //     //       ...r._beforeMiddlewares
  //     //     ]
  //     //   }

  //     //   if (befores.length > 0) {
  //     //     const beforeMiddlewares = middlewarePathsToFunctions(befores, resolver)
  //     //   }

  //     //   if (r._afterMiddlewares.length > 0) {

  //     //   }
  //     // }

  //     const result = await resolverFunc({
  //       source: undefined,
  //       args,
  //       context: { req },
  //       info: undefined,
  //     })

  //     res.send(result)
  //   })
  // })

  return router
})

module.exports = API
