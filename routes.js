const express = require("express");
const User = require("./models/User");
const Bug = require("./models/Bug");
const Projects = require("./models/Project");
const config = require('./config');
const authenticateToken =  require('./AuthMiddleware');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

//Get JWT Token Secret
const { auth: { token_secret } } = config;

/*
*    Register User 
*/
app.post("/add_user",
body('name').isLength({
    min: 5
}).withMessage('Username must be at least 5 characters in length'),

body('password').isLength({
    min: 5
}).withMessage("Password must be at least 5 characters in length"),

async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const array = [];
        errors.array().forEach(e => array.push(e.msg))

        return response.status(400).json({
            success: false,
            errors: array
        });
    }
  
    try {
        const user = new User(request.body);
        const usercheck = await User.findOne({ name: user.name });

        if(usercheck) {
            return response.status(400).json({
                success: false,
                single_error: "Username already in use"
            });
        } else {

            await user.save();

            // Set token with expiration of 1 hour
            const accessToken = await jwt.sign({data: user.name, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, token_secret);

            response.status(200).json({
                success: true,
                accessToken
            });
        }
  

    } catch (error) {
      response.status(500).send(error);
    }
});

/*
*    Login User 
*/
app.post("/login_user", async (request, response) => {

    const user = new User(request.body);
    const username = user.name;
    const password = user.password;
  
    try {
        const usercheck = await User.findOne({ name: user.name });

        if(usercheck) {
            let pw = usercheck.password;
            if(pw === password) {

                // Set token with expiration of 1 hour
                const accessToken = await jwt.sign({data: user.name, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, token_secret);

                response.status(200).json({
                    success: true,
                    accessToken
                });
            } else {
                response.send({"error" : "Incorrect username or password" });
            }
          
        } else {
            response.send({"error" : "Incorrect username or password" });
        }
  

    } catch (error) {
      response.status(500).send(error);
    }
});

/*
*    Get Users 
*/
app.get("/users", async (request, response) => {
    const users = await User.find({});
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
});


/*
*    Get Dashboard
*/
app.post('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({
        authenticated: true
    });
})



module.exports = app;