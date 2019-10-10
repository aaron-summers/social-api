const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const port = process.env.PORT || 3000;

//routes imports
const users = require('../routes/users');
const auth = require('../routes/auth');

//custom methods
const { updateSchema, deleteField } = require("../functions/modifySchema");

//database connection
mongoose.connect(
  `${process.env.DB_CONNECTION}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async () => {
    // updateSchema()
    //delectField()
    console.log("connection enabled");
  }
);

//middleware
//cors
app.use(
  cors({
    origin: ["http://localhost:5050"],
    exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
  })
);
//body parsing
app.use(express.json());

//routes
app.use('/', users);
app.use('/', auth);

app.listen(port, () => console.log(`Example app listening on port  !`));