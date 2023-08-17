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
    FROM reply
    LEFT OUTER JOIN "Reviews" as rev
        ON rev."reviewID" = reply."reviewID";`;
  try {
      const result = await pool.query(query, [userid]);
      const userInfo = result.rows.length > 0 ? result.rows : null;
      return userInfo;
  } catch (error){
      throw error
  }

}



