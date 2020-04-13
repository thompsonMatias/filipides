const
  express = require('express'),
  router = express.Router({}),
  apiRouter = require('./apiRouter'),
  appRouter = require('./appRouter');


//Middleware
router.use('/', (req, res, next) => next());

router
  .use('/api', apiRouter)
  .use('/', appRouter);

module.exports = router;
