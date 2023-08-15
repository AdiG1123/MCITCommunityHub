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

exports.courseStats = async function courseStats(){

    const query = "SELECT \"courseID\", AVG(\"rating\") as averageRating, AVG(\"difficulty\") as averageDifficulty, AVG(\"weeklyHours\") as averageWorkload \
                    FROM \"Reviews\" \
                    GROUP BY \"courseID\";";

    try {
        const result = await pool.query(query, [courseid]);
        const courseStatList = result.rows.length > 0 ? result.rows : null;
        return courseStatList;
    } catch (error){
        throw error
    }

}

exports.allCourseStats = async function allCourseStats(){
    
    const query = `SELECT courses.*, prereqs."prereqid", prereqs."coreq", sem.semester, prof.professor,  stats."averageRating", stats."averageDifficulty", stats."averageWorkload" 
	FROM "Courses" as courses
    FULL OUTER JOIN (SELECT "courseID", array_agg("prereqid") as prereqid, array_agg("coReq") as coreq FROM "Prereqs" GROUP BY "courseID") as prereqs 
        ON courses."courseID" = prereqs."courseID" 
    
    FULL OUTER JOIN (SELECT "courseID", array_agg(semester) as semester FROM "SemesterOffered" GROUP BY "courseID") as sem 
        ON courses."courseID" = sem."courseID" 
    
    FULL OUTER JOIN (SELECT "courseID", array_agg(professor) as professor FROM "Professors" GROUP BY "courseID") as prof 
        ON courses."courseID" = prof."courseID" 
    
    FULL OUTER JOIN (SELECT "courseID", AVG("rating") as "averageRating", AVG("difficulty") as "averageDifficulty", AVG("weeklyHours") as "averageWorkload" 
        FROM (SELECT DISTINCT rrc."courseID", r."rating", r."difficulty", r."weeklyHours" 
                FROM "ReviewReplyContent" as rrc
			  FULL OUTER JOIN (SELECT "reviewID","rating", "difficulty", "weeklyHours" FROM "Reviews") as r
			  	ON rrc."reviewID" = r."reviewID"
                WHERE "parentID"IS NULL) as rcd
        GROUP BY "courseID") as stats
        ON courses."courseID" = stats."courseID"
    ORDER BY courses."courseID";`
    
    try {
        const result = await pool.query(query);
        
        const allCourses = result.rows.length > 0 ? result.rows : null;
        
        return allCourses;
      
    } catch (err) {
        throw err
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
