import {mapSourcePosition} from 'source-map-support'

mapEvalOrigin = (origin) ->
  # Most eval() calls are in this format
  match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin)
  if match
    position = mapSourcePosition
      source: match[2]
      line:   match[3]
      column: match[4]

    return "eval at #{match[1]} (#{position.source}:#{position.line}:#{position.column})"

  # Parse nested eval() calls using recursion
  if match = /^eval at ([^(]+) \((.+)\)$/.exec(origin)
    return "eval at #{match[1]} (#{mapEvalOrigin match[2]})"

  # Make sure we still return useful information if we didn't find anything
  origin

export {mapEvalOrigin, mapSourcePosition}
