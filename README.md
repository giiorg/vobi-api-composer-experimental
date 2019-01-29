# API Composer 

api-composer is a tool to describe node.js APIs with simple and elegant syntax. If you like simplicity and need to build complex GraphQL and/or REST APIs from single API description, you will love api-composer.

## Why?

Simply speaking api-composer is a kind of configuration layer. It's just a way to describe API
with the concepts coming from graphql ecosystem. You can generate anything you want from
this description. You need just write your own plugin for this purpose or use already built plugins. By default api-composer comes with graphql schema generator that is based on excellent [link](https://github.com/graphql-compose/graphql-compose "graphql-composer") library.

With adopting api-composer you can graphqlize even your REST API. 

Here are main benefits:
* Simple and elegant syntax to describe API.
* Single source from which you can generate graphql schema, routes for express/koa and so on.
* Middleware system which you can use to run functions before and after resolve function. You can run some middlewares synchronously and others - asynchronously.


## Getting Started

Install api-composer
```
npm i @vobi/api-composer
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

## More examples

Declaring simple query or mutation can be as easy as:
```js
apiComposer.query('query1', () => 'I am a simple query')

apiComposer.mutation('mutation1', () => 'I am a simple mutation')
```

First argument is the name of query/mutation.
The second argument is optional resolve function.

### License

API Composer is [MIT licensed](./LICENSE).