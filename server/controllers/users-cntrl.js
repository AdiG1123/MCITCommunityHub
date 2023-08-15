const pool = require("./db");

// pulls information for a single user
exports.singleUser = async function user(userid){

  const query = `SELECT * FROM "User" WHERE "userID" = $1`;

  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

// creates a single user
exports.createUser = async function createUser(body){

  const query = `INSERT INTO "User" ("name", "anonName", "timeZone", "expectedGraduation", 
  "industry", "fulltimeStudentStatus", "inTurtleClub", "mcitEmailNotifications",
  "mcitConnectEnable", "mcitConnectEmailNotifications", "email", "linkedinURL", 
  "preferredContactMethod", "bio", "marketOutcome", "workStatus", "startSemester") 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
  RETURNING "userID"`
  
  try {

    const result = await pool.query(query, 
      [body.name, body.anonName, body.timeZone, body.expectedGraduation, 
        body.industry, body.fulltimeStudentStatus, body.inTurtleClub, 
        body.mcitEmailNotifications, body.mcitConnectEnable, body.mcitConnectEmailNotifications, 
        body.email, body.linkedinURL, body.preferredContactMethod, body.bio, body.marketOutcome, 
        body.workStatus, body.startSemester]);
    const newUserID = result.rows.length > 0 ? result.rows : null;
    return newUserID;
} catch (error){
    throw error
}
}

