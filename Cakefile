require 'shortcake'

use 'cake-bundle'
use 'cake-outdated'
use 'cake-publish'
use 'cake-version'

option '-g', '--grep [filter]', 'test filter'
option '-v', '--version [<newversion> | major | minor | patch | build]', 'new version'

task 'clean', 'clean project', (options) ->
  exec 'rm -rf lib'

task 'build', 'build project', (options) ->
  Promise.all [
    bundle.write
      entry: 'src/index.coffee'
    bundle.write
      entry:     'src/register.coffee'
      format:    'cjs'
      dest:      'register.js'
      sourceMap: false
  ]

task 'watch', 'watch for changes and recompile project', ->

task 'test', 'run tests', (options) ->
  test = options.test ? 'test'
  if options.grep?
    grep = "--grep #{options.grep}"
  else
    grep = ''

  exec "NODE_ENV=test mocha
  --colors
  --recursive
  --reporter spec
  --timeout 5000
  --compilers coffee:coffee-script/register
  --require ./register
  #{grep}
  #{test}"

task 'gh-pages', 'Publish docs to gh-pages', ->
  brief = require 'brief'
  brief.update()
