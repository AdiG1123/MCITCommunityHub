var express = require('express');
var courses = require('../controllers/courses-cntrl');

var router = express.Router();

// router.use(verifyToken);

router.get('/', async (req, res) => {
   
    try {
      const courseInfo = await courses.allCourses();
      if (courseInfo) {

        res.json(courseInfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'Courses not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });

  
router.get('/coursestats', async (req, res) => {

  try {
    const courseInfo = await courses.allCourseStats();
    if (courseInfo) {
      res.json(courseInfo); // Respond with course data if found
    } else {
      res.status(404).json({ message: 'Course stats not found' }); // Respond with a 404 status code if course not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

router.get('/coursestats/:courseid', async (req, res) => {
  const courseID = req.params.courseid;
  try {
    const courseInfo = await courses.singleCourseStats(courseID);
    if (courseInfo) {
      res.json(courseInfo); // Respond with course data if found
    } else {
      res.status(404).json({ message: 'Course stats not found' }); // Respond with a 404 status code if course not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
  }
});

router.get('/:coursenum', async (req, res) => {
    const coursenum = req.params.coursenum;
  
    try {
      const course = await courses.singleCourse(coursenum);
      console.log(course);
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: 'Course not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  })

module.exports = router;