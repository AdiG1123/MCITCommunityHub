var express = require('express');
var courses = require('../controllers/courses-cntrl');
var router = express.Router();

router.get('/', async (req, res) => {
  
    try {
      const courseinfo = await courses.allCourses();
  
      if (courseinfo) {
        res.json(courseinfo); // Respond with course data if found
      } else {
        res.status(404).json({ message: 'Courses not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  });


router.get('/:courseid', async (req, res) => {
    const courseid = req.params.courseid;
  
    try {
      const course = await courses.singleCourse(courseid);
      console.log(course["courseID"]);
        
      if (course) {
        
        const coursePrereq = await courses.prereqs(course["courseID"]);
        
        console.log(typeof coursePrereq);
        if (coursePrereq){
            course["prereq"] = coursePrereq
            res.send(course); // Respond with course data if found
        
        }else{
            res.json(course);
        }

      } else {
        res.status(404).json({ message: 'Course not found' }); // Respond with a 404 status code if course not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Respond with a 500 status code if an error occurs
    }
  })

module.exports = router;