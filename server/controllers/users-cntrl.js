const pool = require("./db");

// pulls information for a single user
exports.singleUserByUserID = async function user(userid){
  
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
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
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
    const newUserID = result.rows.length > 0 ? result.rows[0] : null;
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
    const newUserID = result.rows.length > 0 ? result.rows[0] : null;
    return newUserID;
} catch (error){
    throw error
}
}

exports.populateCourseBuilder = async function getUserID(userID){

  const query = `INSERT INTO "CourseBuilder" ("userID", "courseID", "semesterID")
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

exports.updateUser = async function updateUser(body){
  
  const query = `UPDATE "User" 
  SET "name" = $1, "timeZone" = $2, "expectedGraduation" = $3, 
  "industry" = $4, "fulltimeStudentStatus" = ($5::BOOLEAN), "inTurtleClub" = ($6::BOOLEAN), 
  "mcitEmailNotifications" = ($7::BOOLEAN), "mcitConnectEmailNotifications" = ($8::BOOLEAN), 
  "mcitConnectEnable" = $9::BOOLEAN, "startSemester" = $10
  WHERE "userID" = $11
  RETURNING "userID" AS userid`
  
  try {
    const result = await pool.query(query, [body.name, body.timeZone, body.expectedGraduation, body.industry, body.fulltimeStudentStatus,
      body.inTurtleClub, body.mcitEmailNotifications, body.mcitConnectEmailNotifications, body.mcitConnectEnable, body.startSemester, body.userID]);
    const userID = result.rows.length > 0 ? result.rows[0] : null;
    return userID;
} catch (error){
    throw error
}
}


exports.deleteCoursesTaken = async function deleteCoursesTaken(body){
  
  const query = `DELETE FROM "CoursesTaken"
  WHERE "userID" = $1
  RETURNING *`
  
  try {
    const result = await pool.query(query, [body.userID]);
    const userID = result.rows.length > 0 ? result.rows[0] : null;
    return userID;
} catch (error){
    throw error
}
}

exports.updateCoursesTaken = async function updateCoursesTaken(body, courseID){
  
  const query = `INSERT INTO "CoursesTaken" ("userID", "courseID")
  VALUES ($1::INTEGER, $2::INTEGER)
  RETURNING "userID" AS userid`
  
  try {
    const result = await pool.query(query, [body.userID, courseID]);
    const userID = result.rows.length > 0 ? result.rows[0] : null;
    return userID;
} catch (error){
    throw error
}
}

exports.deleteCurrentCourses = async function deleteCurrentCourses(body){
  
  const query = `DELETE FROM "CurrentCourses"
  WHERE "userID" = $1
  RETURNING *`
  
  try {
    const result = await pool.query(query, [body.userID]);
    const userID = result.rows.length > 0 ? result.rows[0] : null;
    return userID;
} catch (error){
    throw error
}
}

exports.updateCurrentCourses = async function updateCurrentCourses(body, courseID){
  
  const query = `INSERT INTO "CurrentCourses" ("userID", "courseID")
  VALUES ($1::INTEGER, $2::INTEGER)
  RETURNING "userID" AS userid`
  
  try {
    const result = await pool.query(query, [body.userID, courseID]);
    const userID = result.rows.length > 0 ? result.rows[0] : null;
    return userID;
} catch (error){
    throw error
}
}