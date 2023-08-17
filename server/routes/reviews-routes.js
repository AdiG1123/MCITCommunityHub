var express = require('express');
var reviews = require('../controllers/reviews-cntrl');
var router = express.Router();
const verifyToken = require('../middleware/verify-token-middleware');


router.get('/:userID', async (req, res) => {
    
    const userID = req.params.userID;
    try {
      const reviewInfo = await reviews.reviewByUser(userID);
  
      if (reviewInfo) {
        res.json(reviewInfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'User not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });




module.exports = router;