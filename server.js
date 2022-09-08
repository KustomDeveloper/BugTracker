const express = require('express');
require('dotenv');
const mongoose = require('mongoose');
const database = require("./db");
const Router = require('./routes');
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);
app.use('/uploads', express.static(__dirname + '/uploads'))

app.listen(process.env.PORT);