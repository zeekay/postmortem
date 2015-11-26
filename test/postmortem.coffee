postmortem = require '../lib'

describe 'postmortem', ->
  it 'should pretty print stack trace', ->
    err = new Error 'eep'
    postmortem.utils.prettyPrint err

  it 'should play nice with the stack', ->
    hasStacks = false

    try
      throw new Error()
    catch err
      hasStacks = !!err.stack

    hasStacks.should.be.true
