const router = require('express').Router();
const { indexController } = require('../controllers');


// Middleware for all routes
router.use('/', (req, res, next) => next());

router
    .route('/')
    .all((req, res, next) => next()) // Middleware for specific route
    .get(indexController.index);

router
    .route('/health-check')
    .get(indexController.healthCheck);


module.exports = router;
