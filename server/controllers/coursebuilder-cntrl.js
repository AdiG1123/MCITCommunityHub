const pool = require("./db");

// gets the information for course planning
exports.courseBuilder = async function courseBuilder(userID){
    const query = `SELECT build."userID", array_agg(build."courseID") as "courseID", array_agg(build."semesterID") as "semesterID", array_agg(course."coursenumber") as coursenumber, "User"."startSemester", "User"."expectedGraduation"
    FROM (SELECT "userID", "courseID", "semesterID" FROM "CourseBuilder" ORDER BY "courseID" ASC) AS build
    
    INNER JOIN (SELECT "User"."userID", "User"."startSemester", "User"."expectedGraduation" FROM "User") as "User"
    ON "User"."userID" = build."userID"

    INNER JOIN (SELECT "Courses"."courseID", "Courses"."coursenumber" FROM "Courses" ORDER BY "courseID" ASC) AS course
    ON course."courseID" = build."courseID"
    
    WHERE build."userID" = $1
    GROUP BY build."userID", "User"."startSemester", "User"."expectedGraduation";`;

    try {
        const result = await pool.query(query, [userID]);
        const course = result.rows.length > 0 ? result.rows[0] : null;
        return course;
    } catch (error){
        console.log("SQL error");
        throw error
    }
}

exports.courseBuilderUpdate = async function courseBuilderUpdate(courseID, userID, newSemesterID){
    const query = `UPDATE "CourseBuilder" AS build
    SET build."semesterID" = $1
    WHERE build."courseID" = $2 AND build."userID" = $3
    RETURNING build."semesterID"`;

    try {
        const result = await pool.query(query, [newSemesterID, courseID, userID]);
        const course = result.rows.length > 0 ? result.rows : null;
        return course;
    } catch (error){
        console.log("SQL error");
        throw error
    }
}


exports.utilSplit = function splitSemesterYear(semesterYear){
    try{
        const splitInfo = semesterYear.split(" ");        
        const year = parseInt(splitInfo[1]);
        return [splitInfo[0], year];
    }catch(error){
        console.log("Util error");
        console.log(error.message);
        throw error
    }
}


