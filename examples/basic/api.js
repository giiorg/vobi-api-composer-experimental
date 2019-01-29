const path = require('path')
const { ApiComposer } = require('@giiorg/vobi-api-composer-experimental')

const apiComposer = new ApiComposer()

/**
 * If you want to provide resolver function by name as string,
 * you must specify directory where your resolvers leave.
 * 
 * Here are example of resolvers directory related to file where we are - api.js,
 * directory ./resolvers will be the place api-composer will look for resolvers.
*/
apiComposer
  .setResolversPath(path.resolve(__dirname, 'resolvers'))

/**
 * This is the way you can create graphql type. It will be stored in api-composer and when
 * you call .getGraphqlSchema later on it will produce graphql type equivalent to:
 * 
 * type SimpleType {
 *   name: String
 *   value: Float
 * }
*/
apiComposer
  .createType('SimpleType', {
    name: 'String',
    value: 'Float'
  })

/** 
 * Simple query
 * 
 * To initialize simple resolver you need this two method: query (or mutation) and resolve
 * .query (and .mutation) takes only one argument - name of query (or mutation)
 * 
 * .resolve takes one argument: async function or string that points to async function
 * 
*/
apiComposer
  .query('hello')
  .resolve(async () => 'Hello, World!')

/**
 * You can also specify arguments with .args method which takes (possibly nested) object
 * You can also specify return type which must be one of graphql scalars
*/
apiComposer
  .query('simple')
  .args({
    name: 'String!'
  })
  .resolve('simple.hello')
  .type('String')

/**
 * We already created type before and now can specify by name 'SimpleType'
 * as return type.
*/
apiComposer
  .mutation('simpleMutation')
  .before('simple.before1')
  .resolve('simple.simpleMutation')
  .type('SimpleType')

/** 
 * We're exporting graphql schema and express router
*/
module.exports = {
  graphqlSchema: apiComposer.getGraphqlSchema(),
  routes: apiComposer.getExpressRoutes()
}