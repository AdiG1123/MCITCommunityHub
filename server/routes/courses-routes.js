var express = require('express');
var courses = require('../controllers/courses-cntrl');
var router = express.Router();

router.get('/', async (req, res) => {
  
    try {
      const courseInfo = await courses.allCourses();
      if (courseInfo) {
        
        // for (var i in courseInfo){
        //   var obj = {
        //     "courseID" : courseInfo[i].courseID,
        //     "coursenumber": courseInfo[i].coursenumber,
        //     "coursename": courseInfo[i].coursename,
        //     "syllabus": courseInfo[i].syllabus,
        //     "description": courseInfo[i].description,
        //     "textbooks": courseInfo[i].textbooks,
        //     "summaryreview": courseInfo[i].summaryreview,
        //     "prereqid": courseInfo[i].prereqid,

        //   }
        // }

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