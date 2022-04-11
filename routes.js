const express = require("express");
const User = require("./models/User");
const Bug = require("./models/Bug");
const Project = require("./models/Project");
const config = require('./config');
const authenticateToken =  require('./AuthMiddleware');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const { auth: { token_secret } } = config;

//  @desc   Register User
//  @route  POST /add_user
//  @access Public
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


//  @desc   Login User
//  @route  POST /login_user
//  @access Public
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

//  @desc   Login User
//  @route  get /login_user
//  @access Private
app.get("/users", authenticateToken, async (req, res) => {
    const users = await User.find({});
  
    try {
        res.status(200).json({
            authenticated: true,
            users: users
        });
    } catch (error) {
      res.status(500).send(error);
    }
});

//  @desc   Dashboard
//  @route  get /dashboard
//  @access Private
app.get('/dashboard', authenticateToken, (req, res) => {
    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    res.status(200).json({
        authenticated: true,
        username: username
    });
})

//  @desc   Show Projects
//  @route  get /projects
//  @access Private
app.get("/projects", authenticateToken, async (req, res) => {

    try {
        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;

        const projects = await Project.find({ project_owner: username });
        
        res.status(200).json({
            authenticated: true,
            projects,
            username
        });
      
    } catch (error) {
        res.status(500).send(error);
    }
});

//  @desc   Create Project
//  @route  POST /create-project
//  @access Private
app.post('/create-project', authenticateToken, async (req, res) => {

    // project_name
    // project_owner
    // created_date

    try {
        const projectName = req.body.project;
        console.log('body: ', req.body)
        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;

        const project = new Project({ 
            project_name: projectName, 
            project_owner: username,
            created_date: Date.now(), 
        });

        await project.save();

        res.status(200).json({
            authenticated: true
        });
    } catch(err) {
        console.error(err)
        res.status(403).json({
            authenticated: false,
            error: err
        });
    }


})

//  @desc   Show Bugs
//  @route  get /bugs
//  @access Private
app.get("/bugs", authenticateToken, async (req, res) => {

    try {
        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;  

        
        //assigned_to
        //project_name

        // const bugs = await Bug.find({ assigned_to: username });
        const bugs = await Bug.find({});

        
        res.status(200).json({
            authenticated: true,
            bugs,
            username
        });
      
    } catch (error) {
        res.status(500).send(error);
    }
});

//  @desc   Add Bug
//  @route  POST /add-bug
//  @access Private
app.post('/add-bug', authenticateToken, async (req, res) => {

    // bug_name
    // assigned_to
    // created_date
    // due_date
    // status
    // project_name
      
    try {
        const bugName = req.body.bug;
        const dueDate = req.body.dueDate;
        const selectedProject = req.body.selectedProject;
        const projectStatus = req.body.projectStatus;
        const assignTo = req.body.assignTo;

        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;

        const bug = new Bug({   bug_name: bugName, 
                                assigned_to: assignTo, 
                                created_date: Date.now(), 
                                due_date: dueDate, 
                                status: projectStatus, 
                                project_name: selectedProject 
                            });
    
        await bug.save();

        res.status(200).json({
            authenticated: true
        });

    } catch(err) {
        res.status(403).json({
            authenticated: false,
            error: err
        });
    }
})



module.exports = app;