const express = require('express');
require('dotenv');
const mongoose = require('mongoose');
const database = require("./db");
const Router = require('./routes');
const cors = require('cors')
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);
app.use('/uploads', express.static(__dirname + '/uploads'))


if(process.env.NODE_ENV === "production" ) {
    //set static folder
    app.use(express.static('client/build'));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(process.env.PORT || 5000);