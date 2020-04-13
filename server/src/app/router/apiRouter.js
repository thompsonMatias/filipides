const
  router = require('express').Router(),
  { apiController } = require('../controllers');


// Middleware for all routes
router.use('/', (req, res, next) => next());

router
  .route('/cookiesignin')
  .post(apiController.cookieSignIn);

router
  .route('/signin') // Exclude for GraphQL Server
  .all((req, res, next) => next()) // Middleware for specific route
  .post(apiController.signIn);

router
  .route('/signout')
  .delete(apiController.signOut);

router
  .route('/signup')
  .post(apiController.signUp);

router
  .route('/deleteaccount')
  .delete(apiController.deleteAccount);


module.exports = router;
