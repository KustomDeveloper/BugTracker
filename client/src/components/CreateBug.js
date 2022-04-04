import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import DatePicker from 'react-datepicker';

const CreateBug = ({allProjects, updateAllProjects}) => {
    const [bug, setBug] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const createNewBug = (e) => {
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
    return(
        
        <form className="bug-form" onSubmit={createNewBug}>
            <h3>Add Bug</h3>
            <div className="form-group">
                <label className="full-width">Select a project</label>
                <select className="form-control">
                    {allProjects.length >= 1 ? allProjects.map((item, key) => 
                        <option key={key} value={item.project_name}>{item.project_name}</option>
                    ) : null}
        
                </select>
            </div>
            <div className="form-group">
                <label className="full-width">Bug name</label>
                <input className="form-control" type="text" name="bug_name" onChange={e => setBug(e.target.value)} value={bug} />
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

            <input className="form-control" type="submit" name="bug_submit" value="Create Bug" /> 
        </form>

    )
}

export default CreateBug;