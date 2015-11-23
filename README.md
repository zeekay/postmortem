## postmortem [![Build Status](https://travis-ci.org/zeekay/postmortem.svg?branch=master)](https://travis-ci.org/zeekay/postmortem)
#### When code dies, it deserves a proper autopsy.
Stacktrace library with support for CoffeeScript and source maps.

### Install
```bash
$ npm install postmortem
```

### Usage
```javascript
require('postmortem').install()

// or

require('postmortem/register')
```


If you use mocha:
```bash
$ mocha --require postmortem/register
```

### Credit
Large amounts of code was lifted from
[source-map-support](https://github.com/evanw/node-source-map-support), without
which this project would not exist.
