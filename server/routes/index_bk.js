const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//


app.get("/courses", async (req, res) => {
    try {
      const allCourses = await pool.query("SELECT * FROM \"Courses\"");
  
      res.json(allCourses.rows);
    } catch (err) {
      console.error(err.message);
      res.sendStatus(404);
    }
  });



//get a course

app.get("/courses/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const courses = await pool.query("SELECT * FROM \"Courses\" WHERE \"coursenumber\" = $1", [
      course_id
    ]);
    console.log(courses);
    // check if course number exists
    if (courses.rows[0] == undefined){
        console.log("%s does not exist", course_id);
        res.sendStatus(404);
    }
    res.json(courses.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(404);
  }
});

app.listen(3000, () => {
    console.log("server has started on port 3000");
  });

