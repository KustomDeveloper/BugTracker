import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import DatePicker from 'react-datepicker';


const CreateBug = ({showProjectForm, updateShowProjectForm, allUsers, updateAllUsers, allProjects, updateAllProjects, updateShowModal}) => {

    const [bug, setBug] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [assignTo, setAssignTo] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [bugError, setBugError] = useState(""); 

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const getProjectForm = () => {
        updateShowProjectForm(true);
    }

    const createNewBug = (e) => {
        e.preventDefault();
        const inputs = {
            bug,
            dueDate,
            selectedProject,
            projectStatus,
            assignTo
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
           
            body: JSON.stringify(inputs)
        };

        fetch('/add-bug', requestOptions)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    setBugError(data.error);
                }
                if(data.authenticated === true) {
                    setBugError("");
                    updateShowModal(false)
                }

        });
        
    }
    return(
        
        <form className="bug-form" onSubmit={createNewBug}>
            <h3>Add Bug</h3>
            <div className="form-group">
                <label className="full-width">Select a project</label>
                <select className="form-control" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} required>
                    <option id='option-empty-one' value="">Choose a project</option>
                    {allProjects.map((item, key) => <option key={key} value={item.project_name}>{item.project_name}</option>)}
                </select>
                <small>Want to <a className="cp-link" onClick={getProjectForm}>Create a Project</a> instead?</small>
            </div>
            <div className="form-group">
                <label className="full-width">Project status</label>
                <select className="form-control" value={projectStatus} onChange={e => setProjectStatus(e.target.value)} required>
                   <option value="">Choose status</option>
                   <option value="open">Open</option>
                   <option value="urgent">Urgent</option>
                   <option value="past due">Past Due</option>
                </select>
            </div>
            <div className="form-group">
                <label className="full-width">Bug name</label>
                <input className="form-control" type="text" name="bug_name" onChange={e => setBug(e.target.value)} value={bug} required/>
            </div>
            
            <div className="form-group">
                <label className="full-width">Assign to</label>
                <select className="form-control" value={assignTo} onChange={e => setAssignTo(e.target.value)} required>
                   <option id="option-empty-two" value="">Select person</option>
                   {allUsers.map((item, key) => (
                    <option key={key} value={item.name}>{item.name}</option>
                   ))}
                </select>
            </div>

            <div className="form-group">
                <label className="full-width">Select due date</label>
                <DatePicker
                    selected={dueDate}
                    onChange={ date => setDueDate(date) }
                    name="startDate"
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                />
            </div>

            <div className="add-bug-errors">{bugError ? bugError.message : null}</div>

            <input className="form-control" type="submit" name="bug_submit" value="Create Bug" /> 
        </form>

    )
}

export default CreateBug;