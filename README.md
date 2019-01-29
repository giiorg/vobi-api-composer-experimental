# API Composer 

Toolkit for generating GraphQL schemas and REST APIs from unified configuration API

## Getting Started

Install api-composer
```
npm i api-composer
```

Import and initialize ApiComposer instance
```js
const { ApiComposer } = require('@vobi/api-composer')

const apiComposer = new ApiComposer()
```

Then you can use it to describe your API
```js
apiComposer
  .query('simpleQuery')
  .resolve(async () => 'I am simple query')
```

After you finish describing your API, then you can generate anything what you want. api-composer comes with GraphQL schema generator which is based on great toolkit graphql-compose. You can get graphql schema like so:
```js
const graphqlSchema = apiComposer.getGraphqlSchema()
```

Whole example of api.js file:
```js
const { ApiComposer } = require('@vobi/api-composer')

const apiComposer = new ApiComposer()

apiComposer
  .query('simpleQuery')
  .resolve(async () => 'I am simple query')

module.exports = {
  graphqlSchema: apiComposer.getGraphqlSchema()
}

```

Then use this schema as you want. For example with Express (index.js):
```js
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { graphqlSchema } = require('./api')

const app = express()
app.use(bodyParser.json())

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
```

You can see whole example in ./examples folder of this repository.

### License

API Composer is [MIT licensed](./LICENSE).