var yargs = require('yargs');

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .commandDir('./commands')
  .help('h')
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .demandCommand(1, 'You need at least one command before moving on')
  .locale('en').argv;
