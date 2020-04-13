const
  mongoose = require('mongoose'),
  { setCategory } = require('app/utils/logEnv'),
  logger = require('log4js').getLogger(setCategory('mongooseClient')),
  path = require('path'),
  fs = require('fs');


// TODO: Crear usuario de mongo y pasar credenciales al sensitive.conf
// let sensitiveConfs;
//
// if(process.env.NODE_ENV !== "production"){
//   sensitiveConfs = fs.readFileSync(path.join('/usr/src/app/server/secrets', 'sensitive.conf'), {encoding: 'utf8'}).split(/[\n\r]/);
// } else {
//   sensitiveConfs = fs.readFileSync(path.join(process.env.SECRETS_PATH, 'sensitive.conf'), {encoding: 'utf8'}).split(/[\n\r]/);
// }
//
// const parsedConfs = sensitiveConfs.reduce((prev, row) => {
//   const pair = row.split('=');
//   if(pair.length > 1){
//     prev[pair[0]] = pair[1];
//   }
//   return prev
// }, {});

const events = [
  "fullsetup",
  "all",
  "reconnectFailed",
  "reconnectTries",
  "connecting",
  "connected",
  "disconnecting",
  "disconnected",
  "reconnected",
  "error",
];

const initMongoose = () => {
  mongoose.connect(uri, options)
    .then(
      context => {
        logger.info(`Connection to MongoDB Success! DB: (${process.env.MONGO_DB}), HOST: (${process.env.MONGO_HOST_0}:${process.env.MONGO_DEFAULT_PORT})`)
      }
    )
};

events.forEach((event, err) => {
  mongoose.connection
    .on(event, function (a) {
      logger.info('Mongoose event', event);
    })
});

mongoose.connection
  .on('error', function(err){
    logger.info('Mongoose event', err);
    err.toString().match(/.*first connect.*/) && setTimeout(() => initMongoose(),3000);
  });


const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4,

  // replicaSet: process.env.MONGO_RS_NAME,
};

// const uri = `mongodb://${parsedConfs.user}:${parsedConfs.pass}@${process.env.MONGO_HOST_0}:${process.env.MONGO_DEFAULT_PORT}/${process.env.MONGO_DB}`;
const uri = `mongodb://${process.env.MONGO_HOST_0}:${process.env.MONGO_DEFAULT_PORT}/${process.env.MONGO_DB}`;


exports.initMongoose = initMongoose;
