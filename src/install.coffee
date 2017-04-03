import './coffee'
import structured    from './structured-stack-trace'
import wrap          from './callsite/wrap'
import {prettyPrint} from './utils'

export default (opts = {}) ->
  opts.handleUncaughtExceptions ?= true
  opts.structuredStackTrace     ?= false

  if opts.handleUncaughtExceptions
    process.on 'uncaughtException', (err) ->
      prettyPrint err, colorize: process.stdout.isTTY
      process.exit 1

  Error.prepareStackTrace = (err, stack) ->
    # rewrite callsites with source map info when possible
    _stack = (wrap err, frame for frame in stack)

    # sentry expects structuredStackTrace
    if opts.structuredStackTrace
      err.structuredStackTrace = structured err, stack

    # return formatted stacktrace
    err + ('\n    at ' + frame for frame in _stack).join ''
