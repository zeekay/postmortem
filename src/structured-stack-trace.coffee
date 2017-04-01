toJSON = ->
  result = {}
  Object.keys(@).forEach (key) =>
    val = @[key]
    if key is 'toJSON'
      return
    else if key is 'this'
      result[key] = '' + val
    else if typeof val is 'function'
      result[key] = '' + val
    else
      result[key] = @[key]
  result

structuredStackTrace = (err, stack) ->
  for frame in stack
    do (frame) ->
      _frame = Object.create {}, frame

      _frame['this']  = frame.getThis()
      try
        _frame.type     = frame.getTypeName()
      catch err
        _frame.type   = ''
      _frame.isTop    = frame.isToplevel()
      _frame.isEval   = frame.isEval()
      _frame.origin   = frame.getEvalOrigin()
      _frame.script   = frame.getScriptNameOrSourceURL()
      _frame.fun      = frame.getFunction()
      _frame.name     = frame.getFunctionName()
      _frame.method   = frame.getMethodName()
      _frame.path     = frame.getFileName()
      _frame.line     = frame.getLineNumber()
      _frame.col      = frame.getColumnNumber()
      _frame.isNative = frame.isNative()
      _frame.pos      = frame.getPosition()
      _frame.isCtor   = frame.isConstructor()
      _frame.file     = path.basename frame.path
      _frame.toJSON   = toJSON
      _frame

export default structuredStackTrace
