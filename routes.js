const express = require("express");
const User = require("./models/User");
const Bug = require("./models/Bug");
const Project = require("./models/Project");

const authenticateToken =  require('./AuthMiddleware');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { makeId } = require("./utils");

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
    },
    region: awsBucketRegion
});

// Img Uploads
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Express JS
const app = express();
app.use(express.json());

const auth = process.env.TOKEN_SECRET;

//  @desc   Upload bug images
//  @route  POST /bug-img-upload
//  @access Private
app.post('/bug-img-upload', authenticateToken, upload.single('screenshot'), async (req, res) => {

    //No Img
    if(!req.file) return res.status(400).json({authenticated: true, error: 'No Img was found!'})

    //Has Img
    if(req.file) {

        try {
            const params = {
                Bucket: awsBucketName,
                Key: req.file.fieldname + "-" + makeId(15) + "-" + req.file.originalname,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }
    
            const command = new PutObjectCommand(params);   
            await s3.send(command);

            const fullUrl = process.env.AWS_IMG_URI + params.Key;
            const findBug = await Bug.updateOne(
                { _id: req.body.id }, 
                { $addToSet: { bug_img: fullUrl }  }
            )

            res.status(200).json({
                authenticated: true,
                img: fullUrl

            });
        
        } catch(err) {
            console.log(err);
        }
    }
});

//  @desc   Get Bug Images
//  @route  get /bug-images
//  @access Private
app.get("/bug-images/:id", authenticateToken, async (req, res) => {
    const findImages = await Bug.findOne({ _id: req.params.id});

    res.status(200).json({
        authenticated: true,
        images: findImages, 
    });

});

//  @desc   Delete Screenshot
//  @route  delete /delete-screenshot
//  @access Private
app.delete("/delete-screenshot", authenticateToken, async (req, res) => {
    const url = req.body.url;
    const id = req.body.id;
    const imgName = url

    const params = {
        Bucket: awsBucketName,
        Key: imgName
    }

    //Delete from Amazon s3
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    const deleteImg = await Bug.updateOne({_id: id }, {$pull: { bug_img:  url }} )

    res.status(200).json({
        authenticated: true
    });
})

//  @desc   Delete Profile Img
//  @route  delete /delete-profile-img
//  @access Private
app.delete("/delete-profile-img", authenticateToken, async (req, res) => {
    const url = req.body.url;
    const id = req.body.id;
    const imgName = url;

    const params = {
        Bucket: awsBucketName,
        Key: imgName
    }

    //Delete from Amazon s3
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    //Delete from Database
    const deleteImg = await Bug.updateOne({_id: id }, {$pull: { bug_img:  url }} )

    res.status(200).json({
        authenticated: true
    });
})

//  @desc   Download Screenshot
//  @route  get /download-img
//  @access Private
app.get('/download-img/:id', authenticateToken, async(req, res) => {
    const imgUrl = req.params.id;

    try {
        const getObjectParams = {
            Bucket: awsBucketName,
            Key: imgUrl,
        }

        res.attachment(imgUrl)

        const command = new GetObjectCommand(getObjectParams);
        const fileStream = await s3.send(command);

        fileStream.Body.pipe(res);
        
    } catch (err) {
        console.log(err)
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
body('firstname').isLength({
    min: 2
}).withMessage('First Name must be at least 2 characters in length'),
body('lastname').isLength({
    min: 2
}).withMessage('Last Name must be at least 2 characters in length'),
body('username').isLength({
    min: 5
}).withMessage('Username must be at least 5 characters in length'),

body('password').isLength({
    min: 5
}).withMessage("Password must be at least 5 characters in length"),

body('email').isLength({
    min: 5
}).withMessage("Email must be at least 5 characters in length"),

body('email').isEmail({
}).withMessage("Please enter a valid email address"),

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
        const username = user.username;
        const email = user.email;

        //Check if username or email already exist
        const usercheck = await User.findOne({ username: username });
        const emailcheck = await User.findOne({ email: email });

        if(usercheck || emailcheck) {
            return response.status(400).json({
                success: false,
                single_error: "Username or Email already in use"
            });
        } else {

            await user.save();

            // Set token with expiration of 1 hour
            const accessToken = await jwt.sign({data: username, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, auth);

            response.status(200).json({
                success: true,
                accessToken
            });
        }
  

    } catch (error) {
    //   response.status(500).send(error);
      console.log(error)
    }
});


//  @desc   Login User
//  @route  POST /login_user
//  @access Public
app.post("/login_user", async (req, res) => {
    const user = new User(req.body);
    const username = user.username;
    const password = user.password;
  
    try {
        const usercheck = await User.findOne({ username: user.username });

        if(usercheck) {
            let pw = usercheck.password;
            if(pw === password) {

                // Set token with expiration of 1 hour
                const accessToken = await jwt.sign({data: username, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, auth);

                res.status(200).json({
                    success: true,
                    accessToken
                });
            } else {
                res.send({"error" : "Incorrect username or password" });
            }
          
        } else {
            res.send({"error" : "Incorrect username or password" });
        }
  

    } catch (error) {
      res.status(500).send(error);
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

//  @desc   Get Current User
//  @route  get /current-user
//  @access Private
app.get("/current-user", authenticateToken, async (req, res) => {
    token = req.headers.authorization.split(' ')[1];

    const userData = jwt.decode(token);
    const username = userData.data;  

    const user = await User.find({username: username});
  
    try {
        res.status(200).json({
            authenticated: true,
            user: user
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

/*
*  Edit Profile Routes
*/

//  @desc   Update Profile First Name
//  @route  PUT /update-profile-firstname
//  @access Private
app.put('/update-profile-firstname/', authenticateToken, async (req, res) => {
    const firstName = req.body.firstName;
    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    try {
        await User.updateOne({ username: username }, { firstname: firstName });

        res.status(200).json({
            authenticated: true,
            message: "First Name Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});

//  @desc   Update Profile Last Name
//  @route  PUT /update-profile-lastname
//  @access Private
app.put('/update-profile-lastname/', authenticateToken, async (req, res) => {
    const lastName = req.body.lastName;
    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    try {
        await User.updateOne({ username: username }, { lastname: lastName });

        res.status(200).json({
            authenticated: true,
            message: "Last Name Updated."
        });
                
    } catch(err) {
        console.log(err);
    }

});

//  @desc   Delete Profile
//  @route  DELETE /delete-profile
//  @access Private
app.delete('/delete-profile/', authenticateToken, async (req, res) => {
    const username = req.body.username;

    try {
        await User.deleteOne({ username: username });

        res.status(200).json({
            authenticated: true,
            message: "Profile deleted."
        });
                
    } catch(err) {
        console.log(err);
    }
});

//  @desc   Upload profile image
//  @route  POST /profile-img-upload
//  @access Private
app.post('/profile-img-upload', authenticateToken, upload.single('avatar'), async (req, res) => {

    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    //No Img
    if(!req.file) return res.status(400).json({authenticated: true, error: 'No Img was found!'})

    //Has Img
    if(req.file) {
        const fullUrl = req.file.filename;

        try {
            const params = {
                Bucket: awsBucketName,
                Key: req.file.fieldname + "-" + makeId(15) + "-" + req.file.originalname,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }
    
            const command = new PutObjectCommand(params);   
            await s3.send(command);

            const findAvatar = await User.updateOne(
                { username: username }, { avatar: `https://${awsBucketName}.s3.amazonaws.com/${params.Key}` } 
            )

            res.status(200).json({
                authenticated: true,
                img: fullUrl
            });
        
        } catch(err) {
            console.log(err);
        }
    }
});

//  @desc   Get Avatar 
//  @route  get /bug-images
//  @access Private
app.get("/profile-avatar/", authenticateToken, async (req, res) => {

    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    // console.log(req)

    const user = await User.findOne({ username: username });

    res.status(200).json({
        authenticated: true,
        userInfo: user, 
    });

});

//  @desc   Delete Avatar
//  @route  delete /delete-avatar
//  @access Private
app.delete("/delete-avatar", authenticateToken, async (req, res) => {
    token = req.headers.authorization.split(' ')[1];
    const userData = jwt.decode(token);
    const username = userData.data;

    const url = req.body.avatar;

    const params = {
        Bucket: awsBucketName,
        Key: url
    }

    //Delete from Amazon s3
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    const deleteAvatar = await User.updateOne({username: username }, { avatar: '' } )

 
    res.status(200).json({
        authenticated: true
    });

})

//  @desc   Show Users Bugs
//  @route  get /users-bugs
//  @access Private
app.get("/users-bugs", authenticateToken, async (req, res) => {

    try {
        token = req.headers.authorization.split(' ')[1];

        const userData = jwt.decode(token);
        const username = userData.data;  

        const bugs = await Bug.find({assigned_to: username});

        res.status(200).json({
            authenticated: true,
            bugs
        });
      
    } catch (error) {
        res.status(500).send(error);
    }
});




module.exports = app;