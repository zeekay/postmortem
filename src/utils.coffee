fs = require 'fs'

{mapSourcePosition} = require './source-map-support'

nodeStackRegex   = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/
coffeeStackRegex = /\((.*)\.coffee:(\d+):(\d+)\)/

prettyPrint = (err, options = {}) ->
  options.colorize ?= false

  match = nodeStackRegex.exec err.stack
  match = coffeeStackRegex.exec err.stack unless match?

  if match? and fs.existsSync match[1]
    position = mapSourcePosition
      source: match[1]
      line:   match[2]
      column: match[3]

    data = fs.readFileSync position.source, 'utf8'
    if line = data.split(/(?:\r\n|\r|\n)/)[position.line - 1]
      console.error position.source + ':' + position.line
      console.error line

      if options.colorize
        caret = '\x1B[31m^\x1B[39m'
      else
        caret = '^'

      console.error ((new Array(+position.column)).join ' ') + caret

  console.error err.stack

module.exports =
  coffeeStackRegex: coffeeStackRegex
  nodeStackRegex:   nodeStackRegex
  prettyPrint:      prettyPrint
