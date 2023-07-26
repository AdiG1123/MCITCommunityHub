var express = require('express');
var courses = require('../controllers/users-cntrl');
var router = express.Router();

router.get('/', courses.list);

module.exports = router;