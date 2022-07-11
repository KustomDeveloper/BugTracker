import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import BugImg from './BugImg';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import DropZone from "./DropZone";

const EditBug = () => {
    const [allUsers, updateAllUsers] = useState([]);
    const [bugDetails, updateBugDetails] = useState([]);
    const [bugTitle, updateBugTitle] = useState("");
    const [bugComplete, updateBugComplete] = useState(Boolean);
    const [bugStatus, updateBugStatus] = useState("");
    const [currentAssignee, updateCurrentAssignee] = useState("");
    const [bugDescription, updateBugDescription] = useState("");
    const [dueDate, updateDueDate] = useState();
    const [bugImages, updateBugImages] = useState([]);

    const navigate = useNavigate();

    const dispatch = useDispatch(); 

    const token = localStorage.getItem('token');

    const { id } = useParams();

    //Get single bug
    useEffect(() => {
        const bugOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch(`/bug/${id}`, bugOptions)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                let bug  = data.bug[0];

                updateBugDetails(bug);
                updateBugTitle(bug.bug_name);
                updateBugStatus(bug.status);
                updateBugDescription(bug.bug_description);
                updateDueDate(new Date(bug.due_date));
                updateCurrentAssignee(bug.assigned_to);
                updateBugImages(bug.bug_img);
                if(bug.status == "complete") updateBugComplete(true)  
                if(bug.status !== "complete") updateBugComplete(false)  
            }
    
        });
    }, [bugComplete]);

    //Get Users
    useEffect(() => {
        const bugOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch(`/users`, bugOptions)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                let users  = data.users;

                updateAllUsers(users);
            }
    
        });
    }, []);

    const saveTitle = (e) => {
        e.preventDefault();

        updateBugTitle(e.target.value);

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ title: e.target.value, id: id })
        };
    
        fetch('/update-bug-title/', options)
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
    const saveAssignedTo = (e) => {
        e.preventDefault();

        updateCurrentAssignee(e.target.value)

        setTimeout(() => {
            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ assigned_to: e.target.value, id: id })
            };
        
            fetch('/update-bug-assigned-to/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    console.log(data.message)
                }
            });

        }, 1000); 
    }

    const saveDescription = (e) => {

        updateBugDescription(e.target.value);

        setTimeout(() => {

            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ description: e.target.value, id: id })
            };
        
            fetch('/update-bug-description/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    console.log(data.message)
                }
        
            });
        }, 1000);
    }

    const saveDate = (date) => {
        updateDueDate(date); 

        setTimeout(() => {

            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ due_date: date, id: id })
            };
        
            fetch('/update-bug-date/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    console.log(data.message)
                }
        
            });

        }, 1000);
    }
 
    const completeBug = (e) => {
        e.preventDefault();

        // Bug Logic For Marking Open or Complete
        if(bugStatus !== "complete") {
            const options = {
                method: 'Put',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ id: id, bug_status: "complete" })
            };
            fetch('/set-bug-status/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    updateBugComplete(true);
                    console.log(data.message);
                    navigate('/dashboard');
                }
            });

        }

        if(bugStatus === "complete") {
            const options = {
                method: 'Put',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ id: id, bug_status: "open" })
            };
            fetch('/set-bug-status/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    updateBugComplete(false)
                    console.log(data.message)
                }
            });

        }

    }
 
    const deleteBug = (e) => {
        e.preventDefault();

        let isConfirmed = window.confirm("Are you sure you want to delete this Bug?");
 
        if(isConfirmed === true) {
            const options = {
                method: 'Delete',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ id: id })
            };
        
            fetch('/delete-bug/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    navigate('/dashboard');
                }
            });
        }

    }


    return(
        <form className="bug-edit-form" encType="multipart/form-data">
            <div className="form-group bug-buttons">
                <button onClick={completeBug} className={`form-control bug-status-btn bug-${bugStatus}`}>{bugStatus == "complete" ? "Completed" : "Mark Complete"}</button>
                <button onClick={deleteBug} className="form-control bug-delete">Delete Bug</button>
            </div>
            <div className="form-group">
                <h3>Title</h3>
                <input className="form-control" value={bugTitle} onChange={e => saveTitle(e) }></input>
            </div>

            <div className="form-group">
                <h3>Assigned To</h3>
                <select className="assigned-to-select form-control" value={currentAssignee} onChange={e => saveAssignedTo(e)} >
                    {allUsers ? allUsers.map((item) => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    )) : null}
                </select>
            </div>
            
            <div className="form-group">
                <h3>Due Date</h3>
                <DatePicker
                    placeholderText={dueDate}
                    selected={dueDate}
                    onChange={ (date) => { saveDate(date) } }
                    name="startDate"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <h3>Description</h3>
                <textarea className="form-control" value={bugDescription} onChange={e => saveDescription(e)}></textarea>
            </div>

            <div className="form-group">
                <h3>Add images</h3>
                <DropZone />
            </div>

            <BugImg bugId={id} />

        </form>
    )
}

export default EditBug