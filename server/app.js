const express = require("express");
const app = express();
const cors = require("cors");
// const pool = require("./db");

// Intialize routes
var routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = 8888;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
  });
