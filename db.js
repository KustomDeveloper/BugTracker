const mongoose = require('mongoose');
const config = require('./config');

const { cloud_db: { username, password } } = config;
const { local_db: { host, port, name } } = config;
// const connectionString = `mongodb://${host}:${port}/${name}`;
const connectionString = `mongodb+srv://${username}:${password}@bugtracker.f6fm60i.mongodb.net/?retryWrites=true&w=majority`;

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
// mongo
// use bugtracker
// db.getCollectionNames()
// bugs projects users
// db.bugs.find()
// db.projects.find()
// db.bugs.find().pretty()
// db.projects.find().pretty()