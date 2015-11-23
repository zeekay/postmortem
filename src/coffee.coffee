_prepareStackTrace = Error.prepareStackTrace

coffeeDetected = /formatSourcePosition\(frame, getSourceMapping/.test _prepareStackTrace
coffeePrepare  = if coffeeDetected then _prepareStackTrace else null

module.exports =
  coffeeDetected: coffeeDetected
  coffeePrepare:  coffeePrepare
