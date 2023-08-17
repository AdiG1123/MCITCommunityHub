var express = require('express');
var courses = require('./courses-routes');
var users = require('./users-routes')
var reviews = require('./reviews-routes')
var router = express.Router();


router.use('/courses', courses);

router.use('/users', users);

router.use('/reviews', reviews)

module.exports = router;