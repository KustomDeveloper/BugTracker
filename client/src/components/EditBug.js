import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import moment from 'moment';

const EditBug = () => {
    const [bugDetails, updateBugDetails] = useState([]);
    const [bugTitle, updateBugTitle] = useState("");
    const [bugDescription, updateBugDescription] = useState("");
    const [dueDate, updateDueDate] = useState();
    const navigate = useNavigate();

    const dispatch = useDispatch(); 

    const token = localStorage.getItem('token');

    const { id } = useParams();

    const titleArea = useRef();
    const descriptionArea = useRef();
    const textAreaBtn = useRef();
    const headlineBtn = useRef();
    const dateBtn = useRef();

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
                updateBugDescription(bug.bug_description);
                updateDueDate(new Date(bug.due_date));
            }
    
        });
    }, []);

    const saveTitle = (e) => {
        e.preventDefault();

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ title: bugTitle, id: id })
        };
    
        fetch('/update-bug-title/', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                headlineBtn.current.classList.remove('show-btn');
            }
    
        });
    }

    const saveDescription = (e) => {
        e.preventDefault();

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ description: bugDescription, id: id })
        };
    
        fetch('/update-bug-description/', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                textAreaBtn.current.classList.remove('show-btn');
            }
    
        });
    }

    const saveDate = () => {
        console.log('saved!');

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ due_date: dueDate, id: id })
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

    const showTitleBtn = () => {
        if (document.activeElement === titleArea.current) {
            headlineBtn.current.classList.add('show-btn');
        }
    }
    const showDescBtn = () => {
        if (document.activeElement === descriptionArea.current) {
            textAreaBtn.current.classList.add('show-btn');
        }
    }



    return(
        <form className="bug-edit-form">
            <div className="form-group">
                <h3>Title</h3>
                <input onFocus={showTitleBtn} ref={titleArea} className="form-control" value={bugTitle} onChange={e => updateBugTitle(e.target.value)}></input>
                <button ref={headlineBtn} onClick={saveTitle} className="form-control bug-title-save">Save</button>
            </div>
            
            <div className="form-group">
                <h3>Due Date</h3>
                <DatePicker
                    placeholderText={dueDate}
                    selected={dueDate}
                    onChange={ (date) => { updateDueDate(date); saveDate()} }
                    name="startDate"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                />
                {/* <button ref={dateBtn} onClick={saveDate} className="form-control bug-date-save">Save</button> */}
            </div>

            <div className="form-group">
                <h3>Description</h3>
                <textarea onFocus={showDescBtn} ref={descriptionArea} className="form-control" value={bugDescription} onChange={e => updateBugDescription(e.target.value)}></textarea>
                <button ref={textAreaBtn} onClick={saveDescription} className="form-control bug-desc-save">Save</button>
            </div>

            <button onClick={deleteBug} className="form-control bug-delete">Delete</button>
        </form>
    )
}

export default EditBug