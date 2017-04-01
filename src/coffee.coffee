_prepareStackTrace = Error.prepareStackTrace

export coffeeDetected = /formatSourcePosition\(frame, getSourceMapping/.test _prepareStackTrace
export coffeePrepare  = if coffeeDetected then _prepareStackTrace else null
