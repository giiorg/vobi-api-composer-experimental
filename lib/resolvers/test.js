const { ApiResponse } = require('../../lib')

class Test {
  test1Before (rp) {
    rp.args.test1Before = true
  }

  test1Before2 (rp) {
    rp.args.test1Before2 = false
  }

  async test1After (rp) {
    console.log('after: ', rp.context.payload)
    rp.context.payload = new ApiResponse({
      payload: rp.context.payload
    })
  }
}

module.exports = Test
