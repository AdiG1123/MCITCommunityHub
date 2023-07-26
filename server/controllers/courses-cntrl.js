const pool = require("./db");

exports.allCourses = async function allCourses(){
    
    const query = "SELECT courses.*, prereqs.\"prereqid\", prereqs.\"coreq\", sem.semester, prof.professor FROM \"Courses\" as courses \
    FULL OUTER JOIN (SELECT \"courseID\", array_agg(\"prereqid\") as prereqid, array_agg(\"coReq\") as coreq FROM \"Prereqs\" GROUP BY \"courseID\") as prereqs \
        ON courses.\"courseID\" = prereqs.\"courseID\" \
    \
    FULL OUTER JOIN (SELECT \"courseID\", array_agg(semester) as semester FROM \"SemesterOffered\" GROUP BY \"courseID\") as sem \
        ON courses.\"courseID\" = sem.\"courseID\" \
    \
    FULL OUTER JOIN (SELECT \"courseID\", array_agg(professor) as professor FROM \"Professors\" GROUP BY \"courseID\") as prof \
        ON courses.\"courseID\" = prof.\"courseID\""
    
    try {
        const result = await pool.query(query);
        
        const allCourses = result.rows.length > 0 ? result.rows : null;
        
        return allCourses;
      
    } catch (err) {
        throw err
      }
}

exports.prereqs = async function prereqs(courseid){

    const query = "SELECT \"prereqid\", \"coReq\" FROM \"Prereqs\" WHERE \"courseID\" = $1";

    try {
        const result = await pool.query(query, [courseid]);
        const prereqList = result.rows.length > 0 ? result.rows : null;
        return prereqList;
    } catch (error){
        throw error
    }

}

exports.singleCourse = async function singleCourse(coursenumber){
    const query = "SELECT * FROM \"Courses\" WHERE \"coursenumber\" = $1";

    try {
        const result = await pool.query(query, [coursenumber]);
        const course = result.rows.length > 0 ? result.rows[0] : null;
        return course;
    } catch (error){
        throw error
    }
}
