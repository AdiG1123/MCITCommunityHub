var express = require('express');
var users = require('../controllers/users-cntrl');
var router = express.Router();

router.get('/:userID', async (req, res) => {
    
    const userID = req.userID;
    try {
      const courseinfo = await users.singleUser();
  
      if (courseinfo) {
        res.json(courseinfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'Courses not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });

module.exports = router;