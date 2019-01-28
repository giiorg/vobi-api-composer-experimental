const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { graphqlSchema, routes } = require('./api')

const app = express()

app.use(bodyParser.json())

routes.get('/user', async (req, res) => {
  res.send('OK');
});
console.log(routes)
app.use('/', routes)

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  })
)

app.listen(8001, function () {
  console.log('app launch on 8001')
  console.log('Go to http://localhost:8001/graphql for preview')
})

