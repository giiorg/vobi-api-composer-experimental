'use strict'

const path = require('path')
const API = require('./api')

const plugins = ['graphql']

const pluginPath =
  pluginName =>
    path.resolve(__dirname, 'plugins', pluginName, 'api')

const ExtendedAPI =
  plugins
    .reduce(
      (API, pluginName) => {
        // try {/
          // console.log(pluginPath(pluginName))
          // API = require(pluginPath(pluginName))
          API = require('./plugins/graphql/api')
        // } catch (e) {
        //   throw new Error('Plugin not found', e)
        // }
        return API
      },
      API
    )

module.exports = {
  ApiComposer: ExtendedAPI,
}
