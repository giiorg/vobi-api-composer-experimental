'use strict'

const { ApiComposer } = require('./index.js')
const a = require('./index.js')
console.log(a)

const mergeApis = (apiComposers) => {
  if (!Array.isArray(apiComposers)) {
    throw new TypeError('You must provide an array of api-composers')
  }

  const resolvers = apiComposers
    .reduce(
      (resolvers, apiComposer) =>
        [...resolvers, ...apiComposer.getResolvers() ], 
        []
      )

  const apiComposer = new ApiComposer()
  apiComposer.setResolvers(resolvers)
  return apiComposer
}

module.exports = mergeApis
