const mongoose = require('mongoose');
const config = require('./config');

const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;

mongoose.connect(connectionString,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


/*
*   Test connection
*/
const test = mongoose.connection;

test.on("error", console.error.bind(console, "connection error: "));
test.once("open", function () {
  console.log("Connected successfully");
});

// Mongo Shell
// db.getCollectionNames()
// bugs projects users
// db.bugs.find()
// db.projects.find()
// db.bugs.find().pretty()
// db.projects.find().pretty()