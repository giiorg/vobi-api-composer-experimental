'use strict'

const {
  TypeComposer,
  schemaComposer,
  Resolver: GQLResolver
} = require('graphql-compose')
const API = require('../../api')
const { chainResolver, nestedInput } = require('./helpers')
const { loadResolverFunc, loadResolverHook } = require('../../helpers')

API.macro('typeFromString', function(typeStr) {
  const type = TypeComposer.schemaComposer.getOrCreateTC(typeStr)
  if (!this._graphqlTypes) {
    this._graphqlTypes = []
  }
  this._graphqlTypes.push(type)
  return type
})

API.macro('createType', function(name, fields) {
  const type = TypeComposer.create({ name, fields })
  if (!this._graphqlTypes) {
    this._graphqlTypes = []
  }
  schemaComposer.set(name, type)
  this._graphqlTypes.push(type)
  return type
})

API.macro('getFieldType', function(name) {
  return TypeComposer.schemaComposer
    .getTC(this._defaultType)
    .getFieldType(name)
    .name
})

API.macro('mutationOf', function(tcName, name) {
  const [type, method] = tcName.split('.')
  const tc = TypeComposer.schemaComposer.getTC(type)
  const res = tc.getResolver(method)
  return this.add({
    name,
    kind: 'mutation',
    args: res.getArgs(),
    type: res.getTypeComposer(),
    resolve: res.getResolve()
  })
})

API.macro('getGraphqlSchema', function () {
  schemaComposer.rootQuery().addFields({})
  schemaComposer.rootMutation().addFields({})

  this._resolvers.forEach((r) => {
    let type
    if (r._type) {
      if (typeof r._type === 'string') {
        if (['String', 'Int', 'Float', 'JSON', 'Date'].includes(r._type)) {
          type = r._type
        } else if (r._type.startsWith('[') && r._type.endsWith(']')) {
          type = [TypeComposer.schemaComposer.getTC(r._type.slice(1, -1))]
        } else {
          type = TypeComposer.schemaComposer.get(r._type)
        }
      } else if (typeof r._type === 'object') {
        type = r._type
      }
    } else {
      type = 'JSON'
    }

    let resolverFunc
    if (typeof r._resolver === 'function') {
      resolverFunc = r._resolver
    } else {
      resolverFunc = loadResolverFunc(r)
    }

    const gqlResolverParams = {
      name: r._name,
      type,
      resolve: resolverFunc
    }
    if (r._args) {
      gqlResolverParams.args = {}

      switch (typeof r._args) {
        case 'string':
          gqlResolverParams.args = nestedInput({
            record: schemaComposer
              .getTC(r._args)
              .getInputTypeComposer()
              .getFields()
          }, r._name)
          break
        case 'object':
          gqlResolverParams.args = nestedInput(r._args, r._name)
          break
      }
    }

    let resolve = new GQLResolver(gqlResolverParams)
    let chainedResolve = null

    if (
      r._policies.length > 0 ||
      r._beforeMiddlewares.length > 0 ||
      r._afterMiddlewares.length > 0
    ) {
      const pathsToFunctions =
        (paths, resolver, isPolicy = false) =>
          paths.map(
            funcPath => loadResolverHook(funcPath, resolver, isPolicy)
          )

      const middlewarePathsToFunctions =
        (middlewares, resolver) => {
          return middlewares.map(
            middleware => ({
              exec: middleware.exec,
              actions: pathsToFunctions(middleware.actions, resolver, !!middleware.isPolicy)
            })
          )
        }

      let befores = []
      if (r._policies.length > 0) {
        befores = [...r._policies]
      }

      if (r._beforeMiddlewares.length > 0) {
        befores = [
          ...befores,
          ...r._beforeMiddlewares
        ]
      }

      chainedResolve = chainResolver(
        resolve,
        {
          before: befores.length > 0
            ? middlewarePathsToFunctions(befores, r)
            : undefined,
          after: r._afterMiddlewares
            ? middlewarePathsToFunctions(r._afterMiddlewares, r)
            : undefined
        }
      )
    }

    const kind = r._kind 
      ? `root${r._kind.charAt(0).toUpperCase()}${r._kind.slice(1)}` 
      : 'rootQuery'

    schemaComposer[kind]().addFields({
      [r._name]: chainedResolve || resolve
    })
  })

  return TypeComposer.schemaComposer.buildSchema()
})

module.exports = API
