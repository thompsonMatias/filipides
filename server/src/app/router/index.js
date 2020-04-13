const
    express = require('express'),
    router = express.Router({}),
    indexRouter = require('./indexRouter'),
  filipidesRouter = require('./filipidesRouter'),
    path = require('path');


//Middleware
router.use('/', (req, res, next) => next());

router
    .use('/', indexRouter)
    .use(`/${process.env.ENDPOINT_PATH}/${process.env.APP_PATH}`, filipidesRouter);

module.exports = router;
