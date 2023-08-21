const pool = require("./db");

// pulls information for a single user
exports.singleUserByUserID = async function user(userid){
  // const query = `SELECT "User".*, coursenum.courseTaken, coursetaking.courseTaking
  // FROM "User"
  
  // INNER JOIN (
  //   SELECT array_agg(course.coursenumber) as courseTaken, taken."userID"
  //   FROM "Courses" AS course

  //   INNER JOIN "CoursesTaken" as taken
  //   ON taken."courseID" = course."courseID"

  //   WHERE taken."userID" = $1
  //   GROUP BY taken."userID"
  // ) AS coursenum
  // ON coursenum."userID" = "User"."userID"

  // INNER JOIN (
  //   SELECT array_agg(course.coursenumber) as courseTaking, taking."userID"
  //   FROM "Courses" AS course

  //   INNER JOIN "CurrentCourses" as taking
  //   ON taking."courseID" = course."courseID"

  //   WHERE taking."userID" = $1
  //   GROUP BY taking."userID"
  // ) AS coursetaking
  // ON coursetaking."userID" = "User"."userID"
  
  // WHERE "User"."userID" = $1`;
  const query = `SELECT *
  FROM "User"
  WHERE "User"."userID" = $1`
  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

exports.checkCoursesTaken = async function courseTaken(userid){
  
  const query = `SELECT taken."userID", array_agg(taken."courseID") AS "coursesTakenID", array_agg(course.coursenumber) AS "coursesTaken"
  FROM (SELECT * 
    FROM "CoursesTaken" as intaken 
    WHERE intaken."userID" = $1) AS taken
  
  INNER JOIN (SELECT "Courses"."courseID", "Courses"."coursenumber" FROM "Courses") as course
  ON course."courseID" = taken."courseID"
    
  
  GROUP BY taken."userID";`
  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

exports.checkCurrentCourses = async function currentCourse(userid){
  
  const query = `SELECT taking."userID", array_agg(taking."courseID") AS "coursesTakingID", array_agg(course.coursenumber) AS "coursesTaking"
  FROM (SELECT * 
    FROM "CurrentCourses" AS intaken 
    WHERE intaken."userID" = $1) AS taking
  
  INNER JOIN (SELECT "Courses"."courseID", "Courses"."coursenumber" FROM "Courses") as course
  ON course."courseID" = taking."courseID"
    
  WHERE taking."userID" = $1
  GROUP BY taking."userID";`
  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}



exports.singleUserBySub = async function user(sub){
  const query = `SELECT * FROM "User" 
  WHERE "User"."sub" = $1`;

  try {
      const result = await pool.query(query, [sub]);
      const userInfo = result.rows.length > 0 ? result.rows : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

// creates a single user
exports.createUser = async function createUser(body, sub){

  const query = `INSERT INTO "User" ("name", "anonName", "timeZone", "expectedGraduation", 
  "industry", "fulltimeStudentStatus", "inTurtleClub", "mcitEmailNotifications",
  "mcitConnectEnable", "mcitConnectEmailNotifications", "email", "linkedinURL", 
  "preferredContactMethod", "bio", "marketOutcome", "workStatus", "startSemester", "sub") 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
  RETURNING "userID"`
  
  try {

    const result = await pool.query(query, 
      [body.name, body.anonName, body.timeZone, body.expectedGraduation, 
        body.industry, body.fulltimeStudentStatus, body.inTurtleClub, 
        body.mcitEmailNotifications, body.mcitConnectEnable, body.mcitConnectEmailNotifications, 
        body.email, body.linkedinURL, body.preferredContactMethod, body.bio, body.marketOutcome, 
        body.workStatus, body.startSemester, sub]);
    const newUserID = result.rows.length > 0 ? result.rows : null;
    return newUserID;
} catch (error){
    throw error
}
}

// get a userID for a sub
exports.getUserID = async function getUserID(sub){

  const query = `SELECT "User"."userID" 
  FROM "User"
  WHERE sub = $1`
  try {
    const result = await pool.query(query, 
      [sub]);
    const newUserID = result.rows.length > 0 ? result.rows : null;
    return newUserID;
} catch (error){
    throw error
}
}

exports.populateCourseBuilder = async function getUserID(userID){

  const query = `INSERT INTO "CourseBuilder"
  SELECT DISTINCT $1::int, "courseID", 0 FROM "Courses"
  RETURNING 0;`
  try {
    const result = await pool.query(query, [userID]);
    const newUserID = result.rows.length > 0 ? result.rows : null;
    return newUserID.length;
} catch (error){
    throw error
}
}