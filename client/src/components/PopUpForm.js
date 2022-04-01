import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from 'framer-motion'
import DatePicker from 'react-datepicker';
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {logInUser} from '../actions';


const PopUpForm = ({ showModal, updateShowModal }) => {
    const isLoggedIn = useSelector(state => state.auth);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [allProjects, updateAllProjects] = useState("");

    // const [projectName, setProjectName] = useState("");
    const [bug, setBug] = useState("");
    const [project, setProject] = useState("");
    const [dueDate, setDueDate] = useState(new Date());

    const backdrop = {
        visible: { opacity: 1},
        hidden: { opacity: 0 }
    }

    const handleChange = (e) => {
      console.log(e)
    }

    const selectProject = () => {
        // Do stuff
    }

    const ClosePopup = (e) => {
        updateShowModal(false)
    }

    const createProject = (e) => {
        e.preventDefault();
        const inputs = {
            project
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
           
            body: JSON.stringify(inputs)
        };

        fetch('/create-project', requestOptions)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) return

                if(data.authenticated === true) {
                    console.log('data sent and authenticated')
                }

        });
        
    }

    const createBug = (e) => {
        e.preventDefault();
        const inputs = {
            bug,
            dueDate
        }
        console.log(dueDate)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
           
            body: JSON.stringify(inputs)
        };

        fetch('/add-bug', requestOptions)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) navigate('/')
                if(data.authenticated === true) {
                    console.log('data sent and authenticated')
                }

        });
        
    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
        console.log('ran')

        fetch('/projects', requestOptions)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) return // Redirect user if not logged in -> use state -> isLoggedIn?


            if(data.authenticated === true) {
                // console.log('data sent and authenticated')
                // console.log(data.projects)
                // console.log(data.id)
                updateAllProjects(data.projects);
            }

    });
    }, [])

    return (
        <AnimatePresence exitBeforeEnter>
            { showModal && (
                <motion.div 
                  className="backdrop"
                  variants={backdrop}
                  initial="hidden"
                  animate="visible">

                    <div className="popup">
                        <div onClick={e => ClosePopup(e)} className="closeButton">X</div>

                        {/* Select Project */}
                        <h3>Select Project</h3>
                        <form onSubmit={selectProject}>
                            <select>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </form>

                       {console.log(allProjects)}

                        <form className="project-form" onSubmit={createProject}>
                            <h3>Create a Project</h3>
                            <div className="form-group">
                                <label className="full-width">Project Name</label>
                                <input className="form-control" type="text" name="project_name" onChange={e => setProject(e.target.value)} value={project} />
                            </div>

                            <input type="submit" name="project_submit" value="Create Project" /> 
                        </form>

                        <form className="bug-form" onSubmit={createBug}>
                            <h3>Add Bug</h3>
                            <div className="form-group">
                                <label className="full-width">Bug Name</label>
                                <input className="form-control" type="text" name="bug_name" onChange={e => setBug(e.target.value)} value={bug} />
                            </div>
                          
                            <div className="form-group">
                                <label className="full-width">Select Due Date</label>
                                <DatePicker
                                    selected={dueDate}
                                    onChange={ date => setDueDate(date) }
                                    name="startDate"
                                    dateFormat="MM/dd/yyyy"
                                    className="form-control"
                                />
                            </div>

                            <input type="submit" name="project_submit" value="Create Bug" /> 
                        </form>

                        </div>

                </motion.div>
            )}
            
        </AnimatePresence>
    )
}

export default PopUpForm