const express = require("express");
const app = express();
const cors = require("cors");
// const pool = require("./db");

// Intialize routes
var routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = 3000;

app.listen(3000, () => {
    console.log("server has started on port 3000");
  });
