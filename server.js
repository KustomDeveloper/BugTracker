const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const database = require("./db");
const Router = require('./routes');
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);

app.listen(config.app.port);