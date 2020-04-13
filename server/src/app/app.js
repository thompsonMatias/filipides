const
  express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  router = require('app/router'),
  cors = require("cors"),
  errorHandler = require('errorhandler'),
  log4js = require('log4js'),
  { setCategory } = require('app/utils/logEnv'),
  logger = require('log4js').getLogger(setCategory('app'));


// app sets
app
  .set('view engine', 'pug')
  .set('views', path.join(__dirname, 'views'))
  .set('port', process.env.PORT);


const corsOptions = {
  origin: [`${process.env.PROTOCOL}://${process.env.DOMAIN_FRONT}`],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: true,
  credentials: true,
};


// app uses
app
  .use(cors(corsOptions))
  .use(`/${process.env.ENDPOINT_PATH}/${process.env.APP_PATH}/`, express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json({limit: '500mb'}, {extended: true}))
  .use(express.urlencoded({extended: true}))
  .use(cookieParser())
  .use('/', router) // Endpoints
  .use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }))
  .use(process.env.NODE_ENV !== 'production'
    ? errorHandler()
    : (err, req, res, next) => {}
  );


module.exports = app;
