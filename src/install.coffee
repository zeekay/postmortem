require './coffee'

module.exports = (options = {}) ->
  options.handleUncaughtExceptions ?= true
  options.structuredStackTrace     ?= false

  if options.handleUncaughtExceptions
    process.on 'uncaughtException', (err) ->
      (require './utils').prettyPrint err, colorize: process.stdout.isTTY
      process.exit 1

  Error.prepareStackTrace = (err, stack) ->
    # rewrite callsites with source map info when possible
    _stack = ((require './callsite/wrap') err, frame for frame in stack)

    # sentry expects structuredStackTrace
    if options.structuredStackTrace
      err.structuredStackTrace = require('./structured-stack-trace') err, stack

    # return formatted stacktrace
    err + ('\n    at ' + frame for frame in _stack).join ''
