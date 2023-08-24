var express = require('express');
var courses = require('./courses-routes');
var coursebuilder = require('./coursebuilder-routes');
var users = require('./users-routes');
var reviews = require('./reviews-routes');
var feedback = require('./feedback-routes');
var router = express.Router();


router.use('/courses', courses);

router.use('/coursebuilder', coursebuilder)

router.use('/users', users);

router.use('/reviews', reviews)

router.use('/feedback', feedback)

module.exports = router;