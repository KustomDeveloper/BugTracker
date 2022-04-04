import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

const CreateProject = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [project, setProject] = useState("");

    const createNewProject = (e) => {
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

  return (
    <form className="project-form" onSubmit={createNewProject}>
        <h3>Create a Project</h3>
        <div className="form-group">
            <label className="full-width">Project Name</label>
            <input className="form-control" type="text" name="project_name" onChange={e => setProject(e.target.value)} value={project} />
        </div>

        <input type="submit" name="project_submit" value="Create Project" /> 
    </form>

  )
}

export default CreateProject;