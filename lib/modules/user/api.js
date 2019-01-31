const { ApiComposer } = require('../../index')

const userApi = new ApiComposer()

// userApi.setResolversPath(path.resolve(__dirname, 'resolvers'))

userApi
  .query('userOne', () => 'User 1')
  .args({
    name: 'String!'
  })

module.exports = userApi