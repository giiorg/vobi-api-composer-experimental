const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const path = require('path')
const { ApiComposer } = require('@giiorg/vobi-api-composer-experimental')

const app = express()

app.use(bodyParser.json())

const apiComposer = new ApiComposer()

apiComposer
  .setResolversPath(path.resolve(__dirname, 'resolvers'))

apiComposer
  .query('simple')
  .args({
    name: 'String!'
  })
  .resolver('simple.hello')

apiComposer
  .mutation('simpleMutation')
  .before('simple.before1')

app.use(
  '/graphql',
  graphqlHTTP({
    schema: apiComposer.getGraphqlSchema(),
    graphiql: true
  })
)

app.listen(8001, function () {
  console.log('app launch on 8001')
  console.log('Go to http://localhost:8001/graphql for preview')
})

