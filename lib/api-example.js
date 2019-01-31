const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const path = require('path')
const { ApiComposer } = require('./index')
const mergeApis = require('./merge-apis')

const app = express()

app.use(bodyParser.json())

const api1 = new ApiComposer()

api1.setResolversPath(path.resolve(__dirname, 'resolvers'))

// api.query('hello', () => 'Hello, World!')
api1.mutation('simpleMutation', () => 'I am a simple mutation')

api1
  .query('test1')
  .resolve((rp) => {
    console.log('rp:', rp)
    return 'Test1'
  })
  // .before(() => { console.log('before Test1') })
  .before(['test.test1Before', 'test.test1Before2'])
  .afterAsync(() => { console.log('after async Test1') })
  .after('test.test1After')

const userApi = require('./modules/user/api')
const postApi = require('./modules/post/api')

const api = mergeApis([
  userApi,
  postApi,
  api1,
])

app.use(api.getExpressRoutes())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: api.getGraphqlSchema(),
    graphiql: true
  })
)

app.listen(8001, function () {
  console.log('app launch on 8001')
  console.log('Go to http://localhost:8001/graphql')
})