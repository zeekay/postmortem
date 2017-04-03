'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var sourceMapSupport = require('source-map-support');

// src/coffee.coffee
var _prepareStackTrace;

_prepareStackTrace = Error.prepareStackTrace;

var coffeeDetected = /formatSourcePosition\(frame, getSourceMapping/.test(_prepareStackTrace);

var coffeePrepare = coffeeDetected ? _prepareStackTrace : null;

// src/structured-stack-trace.coffee
var structuredStackTrace;
var toJSON;

toJSON = function() {
  var result;
  result = {};
  Object.keys(this).forEach((key) => {
    var val;
    val = this[key];
    if (key === 'toJSON') {

    } else if (key === 'this') {
      return result[key] = '' + val;
    } else if (typeof val === 'function') {
      return result[key] = '' + val;
    } else {
      return result[key] = this[key];
    }
  });
  return result;
};

structuredStackTrace = function(err, stack) {
  var frame, i, len, results;
  results = [];
  for (i = 0, len = stack.length; i < len; i++) {
    frame = stack[i];
    results.push((function(frame) {
      var _frame;
      _frame = Object.create({}, frame);
      _frame['this'] = frame.getThis();
      try {
        _frame.type = frame.getTypeName();
      } catch (error) {
        err = error;
        _frame.type = '';
      }
      _frame.isTop = frame.isToplevel();
      _frame.isEval = frame.isEval();
      _frame.origin = frame.getEvalOrigin();
      _frame.script = frame.getScriptNameOrSourceURL();
      _frame.fun = frame.getFunction();
      _frame.name = frame.getFunctionName();
      _frame.method = frame.getMethodName();
      _frame.path = frame.getFileName();
      _frame.line = frame.getLineNumber();
      _frame.col = frame.getColumnNumber();
      _frame.isNative = frame.isNative();
      _frame.pos = frame.getPosition();
      _frame.isCtor = frame.isConstructor();
      _frame.file = path.basename(frame.path);
      _frame.toJSON = toJSON;
      return _frame;
    })(frame));
  }
  return results;
};

var structured = structuredStackTrace;

// src/callsite/clone.coffee
var CallSiteToString;

CallSiteToString = function() {
  var addSuffix, columnNumber, fileLocation, fileName, functionName, isConstructor, isMethodCall, line, lineNumber, methodName, typeName;
  fileName = void 0;
  fileLocation = '';
  if (this.isNative()) {
    fileLocation = 'native';
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ', ';
    }
    if (fileName) {
      fileLocation += fileName;
    } else {
      fileLocation += '<anonymous>';
    }
    lineNumber = this.getLineNumber();
    if (lineNumber !== null) {
      fileLocation += ':' + lineNumber;
      columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ':' + columnNumber;
      }
    }
  }
  line = '';
  functionName = this.getFunctionName();
  addSuffix = true;
  isConstructor = this.isConstructor();
  isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    typeName = this.getTypeName();
    methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) !== 0) {
        line += typeName + '.';
      }
      line += functionName;
      if (methodName && functionName.indexOf('.' + methodName) !== functionName.length - methodName.length - 1) {
        line += ' [as ' + methodName + ']';
      }
    } else {
      line += typeName + '.' + (methodName || '<anonymous>');
    }
  } else if (isConstructor) {
    line += 'new ' + (functionName || '<anonymous>');
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += ' (' + fileLocation + ')';
  }
  return line;
};

var clone = function(frame) {
  var _frame, fn, i, len, name, proto, ref;
  _frame = {};
  proto = Object.getPrototypeOf(frame);
  ref = Object.getOwnPropertyNames(proto);
  fn = function(name) {
    if (/^(?:is|get)/.test(name)) {
      return _frame[name] = function() {
        return frame[name].call(frame);
      };
    } else {
      return _frame[name] = frame[name];
    }
  };
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    fn(name);
  }
  _frame.toString = CallSiteToString;
  return _frame;
};

// src/source-map-support.coffee
var mapEvalOrigin;

mapEvalOrigin = function(origin) {
  var match, position;
  match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    position = sourceMapSupport.mapSourcePosition({
      source: match[2],
      line: match[3],
      column: match[4]
    });
    return `eval at ${match[1]} (${position.source}:${position.line}:${position.column})`;
  }
  if (match = /^eval at ([^(]+) \((.+)\)$/.exec(origin)) {
    return `eval at ${match[1]} (${mapEvalOrigin(match[2])})`;
  }
  return origin;
};

// src/utils.coffee
var nodeStackRegex = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/;

var coffeeStackRegex = /\((.*)\.coffee:(\d+):(\d+)\)/;

var prettyPrint = function(err, opts = {}) {
  var caret, data, line, match, position;
  if (opts.colorize == null) {
    opts.colorize = false;
  }
  match = nodeStackRegex.exec(err.stack);
  if (match == null) {
    match = coffeeStackRegex.exec(err.stack);
  }
  if ((match != null) && fs.existsSync(match[1])) {
    position = sourceMapSupport.mapSourcePosition({
      source: match[1],
      line: match[2],
      column: match[3]
    });
    data = fs.readFileSync(position.source, 'utf8');
    if (line = data.split(/(?:\r\n|\r|\n)/)[position.line - 1]) {
      console.error(position.source + ':' + position.line);
      console.error(line);
      if (opts.colorize) {
        caret = '\x1B[31m^\x1B[39m';
      } else {
        caret = '^';
      }
      console.error(((new Array(+position.column)).join(' ')) + caret);
    }
  }
  return console.error(err.stack);
};

// src/callsite/wrap.coffee
var wrap = function(err, frame) {
  var _frame, column, line, match, origin, position, source;
  if (coffeePrepare && (match = coffeeStackRegex.exec(coffeePrepare(err, [frame])))) {
    _frame = clone(frame);
    _frame.getFileName = function() {
      return match[1] + '.coffee';
    };
    _frame.getLineNumber = function() {
      return match[2];
    };
    _frame.getColumnNumber = function() {
      return match[3] - 1;
    };
    _frame.getScriptNameOrSourceURL = function() {
      return match[1] + '.coffee';
    };
    return _frame;
  }
  source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    line = frame.getLineNumber();
    column = frame.getColumnNumber() - 1;
    if (line === 1 && !frame.isEval()) {
      column -= 62;
    }
    position = sourceMapSupport.mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    _frame = clone(frame);
    _frame.getFileName = function() {
      return position.source;
    };
    _frame.getLineNumber = function() {
      return position.line;
    };
    _frame.getColumnNumber = function() {
      return position.column + 1;
    };
    _frame.getScriptNameOrSourceURL = function() {
      return position.source;
    };
    return _frame;
  }
  origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    _frame = clone(frame);
    _frame.getEvalOrigin = function() {
      return origin;
    };
    return _frame;
  }
  return frame;
};

// src/install.coffee
var install = function(opts = {}) {
  if (opts.handleUncaughtExceptions == null) {
    opts.handleUncaughtExceptions = true;
  }
  if (opts.structuredStackTrace == null) {
    opts.structuredStackTrace = false;
  }
  if (opts.handleUncaughtExceptions) {
    process.on('uncaughtException', function(err) {
      prettyPrint(err, {
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
        results.push(wrap(err, frame));
      }
      return results;
    })();
    if (opts.structuredStackTrace) {
      err.structuredStackTrace = structured(err, stack);
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
