'use strict';

// src/coffee.coffee
var _prepareStackTrace;

_prepareStackTrace = Error.prepareStackTrace;

var coffeeDetected = /formatSourcePosition\(frame, getSourceMapping/.test(_prepareStackTrace);

// src/install.coffee
var install = function(options = {}) {
  if (options.handleUncaughtExceptions == null) {
    options.handleUncaughtExceptions = true;
  }
  if (options.structuredStackTrace == null) {
    options.structuredStackTrace = false;
  }
  if (options.handleUncaughtExceptions) {
    process.on('uncaughtException', function(err) {
      (require('./utils')).prettyPrint(err, {
        colorize: process.stdout.isTTY
      });
      return process.exit(1);
    });
  }
  return Error.prepareStackTrace = function(err, stack) {
    var _stack, frame;
    _stack = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = stack.length; i < len; i++) {
        frame = stack[i];
        results.push((require('./callsite/wrap'))(err, frame));
      }
      return results;
    })();
    if (options.structuredStackTrace) {
      err.structuredStackTrace = require('./structured-stack-trace')(err, stack);
    }
    return err + ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = _stack.length; i < len; i++) {
        frame = _stack[i];
        results.push('\n    at ' + frame);
      }
      return results;
    })()).join('');
  };
};

// src/register.coffee
install({
  handleUncaughtExceptions: false
});
