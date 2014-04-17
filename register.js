var postmortem = require('./lib');

// Automatically install postmortem when this postmortem/register is required.
postmortem.install();

module.exports = postmortem;
