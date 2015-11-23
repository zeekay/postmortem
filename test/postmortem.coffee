postmortem = require '../lib'

describe 'postmortem', ->
  it 'should pretty print stack trace', ->
    err = new Error 'eep'
    postmortem.utils.prettyPrint err
