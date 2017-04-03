## postmortem

[![npm][npm-img]][npm-url]
[![build][build-img]][build-url]
[![dependencies][dependencies-img]][dependencies-url]
[![downloads][downloads-img]][downloads-url]
[![license][license-img]][license-url]
[![chat][chat-img]][chat-url]

### When code dies, it deserves a proper autopsy.
Stacktrace library with support for CoffeeScript and source maps.

## Install
```bash
$ npm install postmortem
```

## Usage
```javascript
require('postmortem').install()

// or

require('postmortem/register')
```


If you use mocha:
```bash
$ mocha --require postmortem/register
```

## Credit
Large amounts of code was lifted from
[source-map-support](https://github.com/evanw/node-source-map-support), without
which this project would not exist.

## License
[MIT][license-url]

[build-img]:        https://img.shields.io/travis/zeekay/postmortem.svg
[build-url]:        https://travis-ci.org/zeekay/postmortem
[chat-img]:         https://badges.gitter.im/join-chat.svg
[chat-url]:         https://gitter.im/zeekay/hi
[coverage-img]:     https://coveralls.io/repos/zeekay/postmortem/badge.svg?branch=master&service=github
[coverage-url]:     https://coveralls.io/github/zeekay/postmortem?branch=master
[dependencies-img]: https://david-dm.org/zeekay/postmortem.svg
[dependencies-url]: https://david-dm.org/zeekay/postmortem
[downloads-img]:    https://img.shields.io/npm/dm/postmortem.svg
[downloads-url]:    http://badge.fury.io/js/postmortem
[license-img]:      https://img.shields.io/npm/l/postmortem.svg
[license-url]:      https://github.com/zeekay/postmortem/blob/master/LICENSE
[npm-img]:          https://img.shields.io/npm/v/postmortem.svg
[npm-url]:          https://www.npmjs.com/package/postmortem
