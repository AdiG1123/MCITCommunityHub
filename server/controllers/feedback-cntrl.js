const pool = require("./db");

// inserts feedback into feedback table
exports.addFeedback = async function addFeedback(feedback){
    const query = `INSERT INTO "Feedback" ("feedback")
    VALUES ($1)
    RETURNING "id"`;
    try {
        const result = await pool.query(query, [feedback]);
        const userInfo = result.rows.length > 0 ? result.rows[0] : null;
        return userInfo;
    } catch (error){
        throw error
    }
  }