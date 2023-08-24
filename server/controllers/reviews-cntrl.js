const pool = require("./db");

// pulls information for a single user
exports.reviewByUser = async function reviewByUser(userid){
  const query = `WITH RECURSIVE reply AS(
  
    SELECT r.*
    FROM "ReviewReplyContent" as r
    WHERE r."userID" = $1 and r."parentID" IS NULL
    
    UNION
        SELECT y.*
        FROM "ReviewReplyContent" as y
        INNER JOIN reply as rep 
            ON rep."reviewID" = y."parentID"
    )
    SELECT CAST(replyone."courseID" AS INTEGER) as "courseID", CAST(replyone."reviewid" AS INTEGER) AS "reviewID", CAST(replyone."parentID" AS INTEGER), 
    CAST(replyone."userID" AS INTEGER), users."anonName", replyone."date", replyone."content", reviews."semester", reviews."professor", reviews."difficulty", 
    reviews."rating", reviews."weeklyHours", reviews."finalGrade", pairings.coursepairing, pairings.pairingrec, pairings."coursepairingID", courseConnect."coursenumber", courseConnect.coursename
    FROM (
      SELECT reply."reviewID"::INTEGER AS "reviewID", reply."reviewID"::INTEGER as "reviewid", reply."courseID", reply."parentID"::INTEGER, reply."userID", reply."date", reply."content" 
      FROM reply
      ) as replyone
      
      LEFT OUTER JOIN "Reviews" as reviews
      ON reviews."reviewID" = replyone."reviewID"
      
      LEFT OUTER JOIN 
      (SELECT "UserCoursePairing"."reviewID", array_agg(course.coursenumber) AS coursepairing, array_agg(course."courseID"::INTEGER) AS "coursepairingID", array_agg("UserCoursePairing"."pairingRec") AS pairingrec
      FROM "UserCoursePairing" INNER JOIN "Courses" as course 
      ON course."courseID" = "UserCoursePairing"."courseID"
      GROUP BY "UserCoursePairing"."reviewID") as pairings
      
      ON pairings."reviewID" = replyone."reviewID"
      
      INNER JOIN (SELECT courseNum."courseID", courseNum."coursenumber", courseNum."coursename" FROM "Courses" as courseNum) as courseConnect
      ON courseConnect."courseID" = replyone."courseID"
      
      INNER JOIN (SELECT "User"."anonName", "User"."userID" 
      FROM "User" ) as users
      ON users."userID" = replyone."userID"`;
  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

// get review by courses
exports.reviewByCourseID = async function reviewByCourseID(courseID){
    const query = `WITH RECURSIVE reply AS(
  
      SELECT r.*
      FROM "ReviewReplyContent" as r
      WHERE r."courseID" = $1 and r."parentID" IS NULL
      
      UNION
          SELECT y.*
          FROM "ReviewReplyContent" as y
          INNER JOIN reply as rep 
              ON rep."reviewID" = y."parentID"
      )
      SELECT CAST(replyone."courseID" AS INTEGER) as "courseID", CAST(replyone."reviewid" AS INTEGER) AS "reviewID", CAST(replyone."parentID" AS INTEGER), 
      CAST(replyone."userID" AS INTEGER), users."anonName", replyone."date", replyone."content", reviews."semester", reviews."professor", reviews."difficulty", 
      reviews."rating", reviews."weeklyHours", reviews."finalGrade", pairings.coursepairing, pairings.pairingrec, pairings."coursepairingID", courseConnect.coursenumber, courseConnect.coursename
      FROM (
        SELECT reply."reviewID"::INTEGER AS "reviewID", reply."reviewID"::INTEGER as "reviewid", reply."courseID", reply."parentID"::INTEGER, reply."userID", reply."date", reply."content" 
        FROM reply
        ) as replyone
        
        LEFT OUTER JOIN "Reviews" as reviews
        ON reviews."reviewID" = replyone."reviewID"
        
        LEFT OUTER JOIN 
        (SELECT "UserCoursePairing"."reviewID", array_agg(course.coursenumber) AS coursepairing, array_agg(course."courseID"::INTEGER) AS "coursepairingID", array_agg("UserCoursePairing"."pairingRec") AS pairingrec
        FROM "UserCoursePairing" INNER JOIN "Courses" as course 
        ON course."courseID" = "UserCoursePairing"."courseID"
        GROUP BY "UserCoursePairing"."reviewID") as pairings
        
        ON pairings."reviewID" = replyone."reviewID"
        
        INNER JOIN (SELECT courseNum."courseID", courseNum."coursenumber", courseNum."coursename" 
        FROM "Courses" as courseNum) as courseConnect
      ON courseConnect."courseID" = replyone."courseID"
      
        INNER JOIN (SELECT "User"."anonName", "User"."userID" 
        FROM "User" ) as users
        ON users."userID" = replyone."userID"

      `;
    try {
        const result = await pool.query(query, [courseID]);
        const userInfo = result.rows.length > 0 ? result.rows : null;
        return userInfo;
    } catch (error){
        throw error
    }
  
  }


exports.addReviewOrCommentByUser = async function addReviewOrCommentByUser(body){
    const query = `INSERT INTO "ReviewReplyContent" ("courseID", "parentID", "userID", "content")
    VALUES ($1::INTEGER, $2::INTEGER, $3::INTEGER, $4)
    RETURNING "reviewID"`;
    try {
        const result = await pool.query(query, [body.courseID, body.parentID, body.userID, body.content]);
        const userInfo = result.rows.length > 0 ? result.rows[0] : null;
        return userInfo;
    } catch (error){
        throw error
    }
  
  }

exports.addMainReview = async function addMainReview(newReviewID, body){
    const query = `INSERT INTO "Reviews" ("reviewID", "semester", "professor", "difficulty", "rating", "weeklyHours", "finalGrade")
    VALUES ($1::INTEGER, $2, $3, $4::INTEGER, $5::INTEGER, $6::INTEGER, $7)
    RETURNING "mainReviewID"`;
    try {
        const result = await pool.query(query, [newReviewID, body.semester, body.professor, body.difficulty, body.rating, body.weeklyHours, body.finalGrade]);
        const userInfo = result.rows.length > 0 ? result.rows[0] : null;
        return userInfo;
    } catch (error){
        throw error
    }
  }

exports.addPairing = async function addPairing(newReviewID, courseIDToAdd, pairingRec){
    const query = `INSERT INTO "UserCoursePairing" ("courseID", "reviewID", "pairingRec")
    VALUES ($1::INTEGER, $2::INTEGER, $3::INTEGER)
    RETURNING "id"`;
    try {
        const result = await pool.query(query, [courseIDToAdd, newReviewID, pairingRec]);
        const userInfo = result.rows.length > 0 ? result.rows[0] : null;
        return userInfo;
    } catch (error){
        throw error
    }
  }

exports.updateReviewOrComment = async function updateReviewOrComment(body){
  const query = `UPDATE "ReviewReplyContent" 
  SET "content" = $1
  WHERE "reviewID" = $2::INTEGER
  RETURNING "reviewID"`;
  try {
      const result = await pool.query(query, [body.content, body.reviewID]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

exports.updateMainReview = async function updateMainReview(body, reviewID){
  const query = `UPDATE "Reviews" 
  SET "semester" = $1, "difficulty" = $2::INTEGER, 
  "rating" = $3::INTEGER, "weeklyHours" = $4::INTEGER, "finalGrade" = $5 
  WHERE "reviewID" = ($6::INTEGER)
  RETURNING "reviewID"`;
  try {
      const result = await pool.query(query, [body.semester, body.difficulty,
        body.rating, body.weeklyHours, body.finalGrade, reviewID]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

exports.deletePairings = async function deletePairings(reviewID){
  const query = `DELETE FROM "UserCoursePairing"
  WHERE "reviewID" = $1`;
  try {
      const result = await pool.query(query, [reviewID]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}

exports.deleteReview = async function updateReview(reviewID){
  const query = `DELETE FROM "ReviewReplyContent"
  WHERE "reviewID" = ($1::INTEGER)
  RETURNING 0`;
  try {
      const result = await pool.query(query, [reviewID]);
      const userInfo = result.rows.length > 0 ? result.rows[0] : null;
      return userInfo;
  } catch (error){
      throw error
  }

}