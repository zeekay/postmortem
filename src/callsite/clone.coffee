CallSiteToString = ->
  fileName = undefined
  fileLocation = ''

  if @isNative()
    fileLocation = 'native'
  else
    fileName = @getScriptNameOrSourceURL()

    if !fileName and @isEval()
      fileLocation = @getEvalOrigin()
      fileLocation += ', ' # Expecting source position to follow.

    if fileName
      fileLocation += fileName
    else
      # Source code does not originate from a file and is not native, but we
      # can still get the source position inside the source string, e.g. in
      # an eval string.
      fileLocation += '<anonymous>'

    lineNumber = @getLineNumber()

    if lineNumber != null
      fileLocation += ':' + lineNumber
      columnNumber = @getColumnNumber()
      if columnNumber
        fileLocation += ':' + columnNumber

  line = ''
  functionName = @getFunctionName()
  addSuffix = true
  isConstructor = @isConstructor()
  isMethodCall = !(@isToplevel() or isConstructor)

  if isMethodCall
    typeName = @getTypeName()
    methodName = @getMethodName()
    if functionName
      if typeName and functionName.indexOf(typeName) != 0
        line += typeName + '.'
      line += functionName
      if methodName and functionName.indexOf('.' + methodName) != functionName.length - (methodName.length) - 1
        line += ' [as ' + methodName + ']'
    else
      line += typeName + '.' + (methodName or '<anonymous>')
  else if isConstructor
    line += 'new ' + (functionName or '<anonymous>')
  else if functionName
    line += functionName
  else
    line += fileLocation
    addSuffix = false
  if addSuffix
    line += ' (' + fileLocation + ')'
  line

module.exports = (frame) ->
  _frame = {}
  proto = Object.getPrototypeOf frame

  for name in Object.getOwnPropertyNames proto
    do (name) ->
      if /^(?:is|get)/.test name
        _frame[name] = -> frame[name].call frame
      else
        _frame[name] = frame[name]

  _frame.toString = CallSiteToString
  _frame
