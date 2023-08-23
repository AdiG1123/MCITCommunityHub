var express = require('express');
var reviews = require('../controllers/reviews-cntrl');
var router = express.Router();


router.get('/byuser/:userID', async (req, res) => {
    
    const userID = req.params.userID;
    try {
      const reviewInfo = await reviews.reviewByUser(userID);
  
      if (reviewInfo) {
        res.json(reviewInfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'Reviews not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });

router.get('/bycourse/:courseID', async (req, res) => {
  
  const courseID = req.params.courseID;
  try {
    const reviewInfo = await reviews.reviewByCourseID(courseID);
    if (reviewInfo) {
      res.json(reviewInfo); // Respond with course data if found
    } else {
      res.status(404).json({ message: 'Reviews not found' }); // Respond with a 404 status code if course not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

router.post('/newreview', async (req, res) => {
  
  const body = req.body;

  try {
    const reviewInfo = await reviews.addReviewOrCommentByUser(body);
    console.log(reviewInfo);
    if (reviewInfo) {
      
      if (!body.parentID){
        const mainReview = await reviews.addMainReview(reviewInfo.reviewID, body);
      }
      if (body.pairingrec && body.coursepairing){
          for (let i = 0; i < body.pairingrec.length; i++){
            const addPairing = await reviews.addPairing(reviewInfo.reviewID, body.coursepairing[i], body.pairingrec[i])
          }
      }
    } else {
      res.status(404).json({ message: 'Reviews failed to add' }); // Respond with a 404 status code if course not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

module.exports = router;