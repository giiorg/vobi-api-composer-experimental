const path = require('path')
const { ApiComposer } = require('@giiorg/vobi-api-composer-experimental')

const apiComposer = new ApiComposer()

apiComposer
  .setResolversPath(path.resolve(__dirname, 'resolvers'))

apiComposer
  .createType('SimpleType', {
    name: 'String',
    value: 'Float'
  })

apiComposer
  .query('simple')
  .args({
    name: 'String!'
  })
  .resolver('simple.hello')
  .type('String')

apiComposer
  .mutation('simpleMutation')
  .before('simple.before1')
  .resolver('simple.simpleMutation')
  .type('SimpleType')

module.exports = {
  graphqlSchema: apiComposer.getGraphqlSchema()
}