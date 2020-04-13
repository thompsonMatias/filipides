const
  router = require('express').Router(),
  { appController } = require('../controllers');


// Middleware for all routes
router.use('/', (req, res, next) => next());

router
  .route(/^\/(?!graphql).*$/) // Exclude for GraphQL Server
  .all((req, res, next) => next()) // Middleware for specific route
  .get(appController.index);


module.exports = router;
