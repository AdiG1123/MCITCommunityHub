require('dotenv').config()

const express = require("express");
const app = express();
const cors = require("cors");

// Intialize routes
var routes = require('./routes');
const verifyToken = require('./middleware/verify-token-middleware');


app.use(cors());
app.use(express.json());
app.use(verifyToken);
app.use('/', routes);

const PORT = 8888;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
  });
