'use strict'

class Simple {
  async hello ({ args: { name } }) {
    return name
  }
}

module.exports = Simple
