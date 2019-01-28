const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { ApiComposer } = require('../../lib')

const app = express()

app.use(bodyParser.json())

const apiComposer = new ApiComposer()

apiComposer
  .query('simple')

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

