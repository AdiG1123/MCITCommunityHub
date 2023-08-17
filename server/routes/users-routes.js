var express = require('express');
var users = require('../controllers/users-cntrl');
var router = express.Router();

router.post('/', async (req, res) => {
  const sub = req.user.sub;
  try {
    const userInfo = await users.createUser(req.body, sub);
    // console.log(`info: ${userInfo}`)
    
    if (userInfo) {
      res.json(userInfo); // Respond with new user info
    } else {
      res.status(406).json({ message: 'User not added succesfully' }); // Respond with a 406 status code if user unable to be added
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});


router.get('/:userID', async (req, res) => {
    
    const userID = req.params.userID;
    try {
      const userinfo = await users.singleUser(userID);
  
      if (userinfo) {
        res.json(userinfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'User not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });




module.exports = router;