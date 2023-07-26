var express = require('express');
var courses = require('./courses-routes');
var users = require('./users-routes')
var router = express.Router();

router.use('/courses', courses);

router.use('/users', users);


module.exports = router;