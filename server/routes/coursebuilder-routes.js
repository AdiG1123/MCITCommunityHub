var express = require('express');
var coursebuilder = require('../controllers/coursebuilder-cntrl');

var router = express.Router();
 
 // gets the course planning schedule for a single user
router.get('/:userid', async (req, res) => {
    const userid = req.params.userid;

    try {
      const courseBuildInfo = await coursebuilder.courseBuilder(userid);
            
      const splitGrad = coursebuilder.utilSplit(courseBuildInfo[0]["expectedGraduation"]);
      courseBuildInfo[0]["graduationSemester"] = splitGrad[0];
      courseBuildInfo[0]["graduationYear"] = splitGrad[1];
      
      const splitStart = coursebuilder.utilSplit(courseBuildInfo[0]["startSemester"]);
      courseBuildInfo[0]["startSemester"] = splitStart[0];
      courseBuildInfo[0]["startYear"] = splitStart[1];        
      
      if (courseBuildInfo) {
        res.json(courseBuildInfo); // Respond with course builder data
      } else {
        res.status(404).json({ message: 'Could not find course builder for this user' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });

// updates a single course change in the builder
router.put('/', async (req, res) => {
    const body = req.body;
    const newSemID = body["semesterID"];
    const courseIDToUpdate = body["courseID"];
    const userIDToUpdate = body["userID"];

    try {
      const courseBuildUpdate = await coursebuilder.courseBuilderUpdate(courseIDToUpdate, userIDToUpdate, newSemID);
      
      if (courseBuildUpdate) {
        res.json({message: 'Successful Update'}); // Respond with course builder data
      } else {
        res.status(404).json({ message: 'Could not find course builder for this user' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });

module.exports = router;