const mongoose = require('mongoose');
const config = require('./config');
require('dotenv').config();
const path = require('path');


const { local_db: { host, port, name } } = config;
// const connectionString = `mongodb://${host}:${port}/${name}`;

const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((err) => console.log(err));


/*
*   Test connection
*/
// const test = mongoose.connection;

// test.on("error", console.error.bind(console, "connection error: "));
// test.once("open", function () {
//   console.log("Connected successfully");
// });

// Mongo Shell
// mongo
// use bugtracker
// db.getCollectionNames()
// bugs projects users
// db.bugs.find()
// db.projects.find()
// db.bugs.find().pretty()
// db.projects.find().pretty()