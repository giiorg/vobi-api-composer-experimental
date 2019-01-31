const path = require('path')
const { ApiComposer } = require('../../index')

const postApi = new ApiComposer()

postApi.setResolversPath(path.resolve(__dirname, 'resolvers'))

postApi
  .query('postOne', 'postOne')

module.exports = postApi