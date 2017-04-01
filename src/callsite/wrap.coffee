import clone from './clone'

import {coffeePrepare}                    from '../coffee'
import {coffeeStackRegex}                 from '../utils'
import {mapSourcePosition, mapEvalOrigin} from '../source-map-support'

export default (err, frame) ->
  # If using coffee 1.6.2+ executable we can derive source, line, and column
  # from it's prepareStackTrace function
  if coffeePrepare and match = coffeeStackRegex.exec coffeePrepare err, [frame]
    _frame = clone frame
    _frame.getFileName              = -> match[1] + '.coffee'
    _frame.getLineNumber            = -> match[2]
    _frame.getColumnNumber          = -> match[3] - 1
    _frame.getScriptNameOrSourceURL = -> match[1] + '.coffee'
    return _frame

  # Most call sites will return the source file from getFileName(), but code
  # passed to eval() ending in "//@ sourceURL=..." will return the source file
  # from getScriptNameOrSourceURL() instead
  source = frame.getFileName() or frame.getScriptNameOrSourceURL()

  if source
    line   = frame.getLineNumber()
    column = frame.getColumnNumber() - 1

    if line == 1 and not frame.isEval()
      column -= 62;

    position = mapSourcePosition
      source: source
      line:   line
      column: column

    _frame = clone frame
    _frame.getFileName              = -> position.source
    _frame.getLineNumber            = -> position.line
    _frame.getColumnNumber          = -> position.column + 1
    _frame.getScriptNameOrSourceURL = -> position.source
    return _frame

  # Code called using eval() needs special handling
  origin = frame.isEval() and frame.getEvalOrigin()
  if origin
    origin = mapEvalOrigin origin

    _frame = clone frame
    _frame.getEvalOrigin = -> origin
    return _frame

  # If we get here then we were unable to change the source position
  frame
