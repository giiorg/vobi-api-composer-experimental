'use strict'

const arrayfy =
  src =>
    Array.isArray(src)
      ? src
      : [src]

const camelCaseToDashed = str =>
  str.replace(
    /([A-Z])/g,
    a => `-${a.toLowerCase()}`
  )

const filterMiddlewaresByName =
  name =>
    m => {
      if (m._only && m._only.length > 0) {
        if (m._only.includes(name)) {
          return m
        }
      } else {
        if (!m._except || !m._except.includes(name)) {
          return m
        }
      }
    }
    
const capitalize = 
  str => 
    str
      .charAt(0)
      .toUpperCase() + str.slice(1)

const loadResolverHook = (hook, resolver, isPolicy) => {
  const cwd = process.cwd()
  let resolverFunc = null
  if (typeof hook === 'string') {
    const [controller, action] = hook.split('.')
    const rPath =
      isPolicy
        ? `${cwd}/src/policies/${controller}`
        : `${resolver._resolversPath}/${controller}`
    if (action) {
      const CtrlClass = require(rPath)
      const Ctrl = new CtrlClass()
      resolverFunc = Ctrl[action]
    } else {
      resolverFunc = require(rPath)
    }
  } else {
    resolverFunc = hook
  }
  if (typeof resolverFunc !== 'function') {
    throw new Error('resolver is not a function!')
  }
  return resolverFunc
}

const loadResolverFunc = resolver => {
  let resolverFunc = null
  if (typeof resolver._resolver === 'string') {
    const [controller, action] = resolver._resolver.split('.')
    if (action) {
      const CtrlClass = require(`${resolver._resolversPath}/${controller}`)
      const Ctrl = new CtrlClass()
      resolverFunc = Ctrl[action]
    } else {
      resolverFunc = require(`${resolver._resolversPath}/${controller}`)
    }
  } else {
    resolverFunc = resolver
  }
  if (typeof resolverFunc !== 'function') {
    throw new Error('resolver is not a function!')
  }
  return resolverFunc
}

const loadPolicy = func => {
  const cwd = process.cwd()
  let resolverFunc = null
  if (typeof func === 'string') {
    const [controller, action] = func.split('.')
    if (action) {
      const CtrlClass = require(`${cwd}/src/policies/${controller}`)
      const Ctrl = new CtrlClass()
      resolverFunc = Ctrl[action]
    } else {
      resolverFunc = require(`${cwd}/src/policies/${controller}`)
    }
  } else {
    resolverFunc = func
  }
  if (typeof resolverFunc !== 'function') {
    throw new Error('resolver is not a function!')
  }
  return resolverFunc
}

module.exports = {
  camelCaseToDashed,
  arrayfy,
  filterMiddlewaresByName,
  capitalize,
  loadResolverHook,
  loadResolverFunc,
  loadPolicy,
}