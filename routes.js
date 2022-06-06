const express = require("express");
const User = require("./models/User");
const Bug = require("./models/Bug");
const Project = require("./models/Project");
const config = require('./config');
const authenticateToken =  require('./AuthMiddleware');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const DIR = './public/bug_images/';

const app = express();
app.use(express.json());

const { auth: { token_secret } } = config;

//File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


//  @desc   Upload images
//  @route  PUT /bug-img-upload
//  @access Private
app.put('/bug-img-upload', authenticateToken, upload.array('bug-img'), async (req, res) => {
    // const id = req.body.id;

    try {
        
                
    } catch(err) {
        console.log(err);
    }
});



//  @desc   Check login status
//  @route  get /check-login-status
//  @access Private
app.get("/check-login-status", authenticateToken, async (req, res) => {

    res.status(200).json({
        authenticated: true
    });

});

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

//  @desc   Get Users
//  @route  get /users
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


//  @desc   Get Project Name
//  @route  get /get-project-name
//  @access Private
app.get("/get-project-name/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        token = req.headers.authorization.split(' ')[1];
        const userData = jwt.decode(token);
        const bug = await Bug.findById(id);
        
        res.status(200).json({
            authenticated: true,
            project_name: bug.project_name
        });
      
    } catch (error) {
        res.status(500).send(error);
    }
});


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


//  @desc   Get Bug
//  @route  get /bug/:id
//  @access Private
app.get("/bug/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;  

        const bug = await Bug.find({_id: id});

        res.status(200).json({
            authenticated: true,
            bug,
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
    // bug_description
      
    try {
        const bugName = req.body.bug;
        const dueDate = req.body.dueDate;
        const selectedProject = req.body.selectedProject;
        const projectStatus = req.body.projectStatus;
        const assignTo = req.body.assignTo;
        const bugDescription = req.body.bugDescription

        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;

        const bug = new Bug({   bug_name: bugName, 
                                assigned_to: assignTo, 
                                created_date: Date.now(), 
                                due_date: dueDate, 
                                status: projectStatus, 
                                project_name: selectedProject,
                                bug_description: bugDescription
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

//  @desc   Update Bug Title
//  @route  PUT /update-bug-title
//  @access Private
app.put('/update-bug-title/', authenticateToken, async (req, res) => {
    const bugName = req.body.title;
    const id = req.body.id;

    try {
        await Bug.updateOne({ _id: id }, { bug_name: bugName });

        res.status(200).json({
            authenticated: true,
            message: "Title Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});
//  @desc   Update Bug Assignee
//  @route  PUT /update-bug-assigned-to
//  @access Private
app.put('/update-bug-assigned-to/', authenticateToken, async (req, res) => {
    const bugAssignedTo = req.body.assigned_to;
    console.log(bugAssignedTo)
    const id = req.body.id;

    try {
        await Bug.updateOne({ _id: id }, { assigned_to: bugAssignedTo });

        res.status(200).json({
            authenticated: true,
            message: "Assignee Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});

//  @desc   Update Bug Description
//  @route  PUT /update-bug-description
//  @access Private
app.put('/update-bug-description/', authenticateToken, async (req, res) => {
    const id = req.body.id;
    const bugDescription = req.body.description;

    try {
        await Bug.updateOne({ _id: id }, { bug_description: bugDescription });

        res.status(200).json({
            authenticated: true,
            message: "Description Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});

//  @desc   Update Bug Due Date
//  @route  PUT /update-bug-date
//  @access Private
app.put('/update-bug-date/', authenticateToken, async (req, res) => {
    const id = req.body.id;
    const dueDate = req.body.due_date;

    try {
        await Bug.updateOne({ _id: id }, { due_date: dueDate });

        res.status(200).json({
            authenticated: true,
            message: "Date Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});

//  @desc   Update Bug Project Name
//  @route  PUT /update-bug-project
//  @access Private
app.put('/update-bug-project/', authenticateToken, async (req, res) => {
    const id = req.body.id;
    const bugProject = req.body.project;

    try {
        await Bug.updateOne({ _id: id }, { project_name: bugProject });

        res.status(200).json({
            authenticated: true,
            message: "Project Name Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});


//  @desc   Set Bug Status
//  @route  PUT /set-bug-status
//  @access Private
app.put('/set-bug-status/', authenticateToken, async (req, res) => {
    const id = req.body.id;
    const bugStatus = req.body.bug_status;

    try {
        await Bug.updateOne({ _id: id}, {status: bugStatus });
            res.status(200).json({
                authenticated: true,
                message: `Bug marked ${bugStatus}.`
            });
                
    } catch(err) {
        console.log(err);
    }
});

//  @desc   Delete Bug
//  @route  DELETE /delete-bug
//  @access Private
app.delete('/delete-bug/', authenticateToken, async (req, res) => {
    const id = req.body.id;

    try {
        await Bug.deleteOne({ _id: id });

        res.status(200).json({
            authenticated: true,
            message: "Bug deleted."
        });
                
    } catch(err) {
        console.log(err);
    }
});




module.exports = app;