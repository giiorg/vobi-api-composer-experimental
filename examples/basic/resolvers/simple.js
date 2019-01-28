'use strict'

class Simple {
  async hello ({ args: { name } }) {
    return name
  }

  async before1 () {
    console.log('before 1: ra xdeba?')
  }
}

module.exports = Simple
