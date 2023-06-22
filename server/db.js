const Pool = require("pg").Pool;

const pool = new Pool({
  user: "pg-dev",
  password: "test1234",
  host: "localhost",
  port: 5432,
  database: "courses"
});


module.exports = pool;