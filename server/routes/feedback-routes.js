var express = require('express');
var feedback = require('../controllers/feedback-cntrl');
var router = express.Router();

router.post('/', async (req, res) => {
    const feedbackContent = req.body.feedback;
    try {
      const feedbackID = await feedback.addFeedback(feedbackContent);
      if (feedbackID) {
        res.json(feedbackID);
      } else {
        res.status(404).json({ message: 'Feedback failed to insert' }); 
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); 
  }
});

module.exports = router;