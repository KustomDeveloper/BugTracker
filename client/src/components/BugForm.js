import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const BugForm = () => {
    const [bugDetails, updateBugDetails] = useState([]);
    const [bugTitle, updateBugTitle] = useState("");
    const [bugDescription, updateBugDescription] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch(); 

    const token = localStorage.getItem('token');

    const { id } = useParams();

    const titleArea = useRef();
    const descriptionArea = useRef();
    const textAreaBtn = useRef();
    const headlineBtn = useRef();

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
                updateBugDetails(data.bug[0]);
                updateBugTitle(data.bug[0].bug_name);
                updateBugDescription(data.bug[0].bug_description);
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
                // console.log(data.message);
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
                // console.log(data.message);
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

export default BugForm