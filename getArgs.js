const ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
  version: '0.1.1',
  addHelp:true,
  description: 'mini-status backend program'
});

parser.addArgument(
  [ '-u', '--uri' ],
  {
    help: `uri for api, default '/update'`,
    defaultValue:'/update'
  }
);
parser.addArgument(
  [ '-a', '--address' ],
  {
    help: 'address to listen, default 0.0.0.0:8080',
    defaultValue:'0.0.0.0:8080'
  }
);
parser.addArgument(
  ['-p', '--password'],
  {
    help: 'access password, default 1234567890',
    defaultValue:'1234567890'
  }
);


module.exports = () => parser.parseArgs()