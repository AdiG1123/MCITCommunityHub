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
    SELECT *
      FROM (
        SELECT reply."reviewID"::INTEGER AS "reviewid", reply."reviewID" as "reviewID", reply."courseID", reply."parentID"::INTEGER, reply."userID", reply."date", reply."content" 
        FROM reply
        ) as replyone
        LEFT OUTER JOIN "Reviews"
        ON "Reviews"."reviewID" = replyone."reviewid";`;
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
      SELECT *
      FROM (
        SELECT reply."reviewID"::INTEGER AS "reviewid", reply."reviewID" as "reviewID", reply."courseID", reply."parentID"::INTEGER, reply."userID", reply."date", reply."content" 
        FROM reply
        ) as replyone
        LEFT OUTER JOIN "Reviews"
        ON "Reviews"."reviewID" = replyone."reviewid";`;
    try {
        const result = await pool.query(query, [courseID]);
        const userInfo = result.rows.length > 0 ? result.rows : null;
        return userInfo;
    } catch (error){
        throw error
    }
  
  }


exports.addReviewByUser = async function addReviewByUser(userid){
    const query = `SELECT * FROM "ReviewReplyContent"`;
    try {
        const result = await pool.query(query, [userid]);
        const userInfo = result.rows.length > 0 ? result.rows : null;
        return userInfo;
    } catch (error){
        throw error
    }
  
  }

