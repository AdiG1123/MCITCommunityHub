const Pool = require("pg").Pool;

const pool = new Pool({
  user: "admin",
  password: "ag123",
  host: "localhost",
  port: 5432,
  database: "MCITCommunityHub"
});


module.exports = pool;