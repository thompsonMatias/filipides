#!/usr/bin/env node

const
  path = require('path'),
  debug = require('debug')('server'),
  http = require('http');


// environment global access
// require('custom-env').env(process.env.NODE_ENV, path.join(__dirname,'environments'));
require('dotenv-flow').config({path: path.join(__dirname,'environments')});


// Set logger config
const
  log4js = require('log4js'),
  { setCategory } = require('app/utils/logEnv');

log4js.configure('./log4js.json');
const logger = log4js.getLogger(setCategory('server'));


// Create HTTPS server.
const
  { initApollo } = require('app/apollo'),
  { initMongoose } = require('app/mongoose'),
  app = require('./app/app'),
  server = http.createServer(app);


// Set listen port
server.listen(app.settings.port , () => logger.info(`🚀 Express server ready at http://${process.env.DOMAIN_BACK}/${process.env.ENDPOINT_PATH}/${process.env.APP_PATH}  with PID: ${process.pid}`) );


// Manage Errors
server
  .on('error', onError)
  .on('listening', onListening);


// clients Initializations
initApollo(app, server);
initMongoose();


// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof app.settings.port === 'string'
    ? 'Pipe ' + app.settings.port
    : 'Port ' + app.settings.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}


// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
