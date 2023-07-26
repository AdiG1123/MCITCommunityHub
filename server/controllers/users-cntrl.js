const pool = require("./db");

exports.list = async(req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM \"User\"");
    
        res.json(allUsers.rows);
      } catch (err) {
        console.error(err.message);
        res.sendStatus(404);
      }
}