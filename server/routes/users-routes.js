var express = require('express');
var users = require('../controllers/users-cntrl');
var router = express.Router();

// create a user
router.post('/', async (req, res) => {
  //const sub = req.user.sub;
  try {
    const userInfo = await users.createUser(req.body, 123123123123);
    console.log(userInfo);
    if (userInfo) {
      const lenCourseBuild = users.populateCourseBuilder(userInfo[0]["userID"])
      console.log(lenCourseBuild);
      res.json(userInfo); // Respond with new user info
    } else {
      res.status(406).json({ message: 'User not added succesfully' }); // Respond with a 406 status code if user unable to be added
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

// gets the userID for the current user
router.get('/getuserid', async (req, res) => {
    
  //const sub = req.user.sub;
  try {
    const userinfo = await users.getUserID(sub);

    if (userinfo) {
      res.json(userinfo); // Respond with course data
    } 
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

// gets the user info given the userID
router.get('/:userID', async (req, res) => {
    
    const userID = req.params.userID;
    try {
      const userinfo = await users.singleUserByUserID(userID);
  
      if (userinfo) {
        res.json(userinfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'User not found' }); // Respond with a 404 status code if user not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });




module.exports = router;