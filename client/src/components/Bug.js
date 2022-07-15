import React, {useEffect, useState, useRef} from "react";
import { logInUser, logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import EditBug from "./EditBug";
import Logo from "./Logo";

const Bug = () => {
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { id } = useParams();

    const [logInStatus, setLoginStatus] = useState(true);
    const [allProjects, updateAllProjects] = useState();
    const [projectName, updateProjectName] = useState("");

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch('/check-login-status', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                setLoginStatus(false);
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                dispatch(logInUser());
            }
    
        });
       
    }, [setLoginStatus])

    useEffect(() => {
        const inputs = {
            id
        }
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
        };
    
        fetch('/get-project-name/' + inputs.id, options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                setLoginStatus(false);
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                updateProjectName(data.project_name);
            }
    
        });
       
    }, [])

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
        };
    
        fetch('/projects', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                setLoginStatus(false);
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                updateAllProjects(data.projects)
            }
    
        });
       
    }, [])

    
    const saveProject = (e) => {
        e.preventDefault();

        updateProjectName(e.target.value);

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ project: e.target.value, id: id })
        };
    
        fetch('/update-bug-project/', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                console.log(data.message)
            }
    
        });
    }

    const redirectToLoginForm = () => {
        navigate('/');
    }

    return (
 
        <div className="dashboard row h-100 bug-single-dashboard">
            <div className="col col-md-3 col-left">
                <Logo />
                <h2>My Space</h2>
                <hr />

                <ul className="screen-options">
                    <Link to="/dashboard"><li className="unselected"><i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard</li></Link>
                    <li className="selected"><i className="fa fa-bug" aria-hidden="true"></i> Bug</li>
                </ul>

                <button className="settings">Settings</button>

            </div>

            <div className="col col-md-3 col-mid bug-single-mid"> 

                <h3 className="project-name-title">Project Name</h3>
                <div className="select-wrapper">
                    <select className="edit-project-selector" name="edit-project-name" value={projectName} onChange={e => saveProject(e)}>
                        {allProjects ? allProjects.map((item) => (
                            <option key={item._id} value={item.project_name}>{item.project_name}</option>
                        )) : null}
                    </select>
                </div>

            </div>

            <div className="col col-md-6 col-right">
                <div className="bug-card">
                    {isLoggedIn === true ? <EditBug /> : redirectToLoginForm()} 
                </div>
            </div>
        </div>
    )
}

export default Bug;