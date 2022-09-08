const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((err) => console.log(err));


// Mongo Shell
// mongo
// use bugtracker
// db.getCollectionNames()
// bugs projects users
// db.bugs.find()
// db.projects.find()
// db.bugs.find().pretty()
// db.projects.find().pretty()