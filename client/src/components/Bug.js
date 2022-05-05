import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useDispatch } from 'react-redux';
import Header from './Header';
import { useParams } from "react-router-dom";

const Bug = () => {
    const [bugDetails, updateBugDetails] = useState([]);
    const [bugTitle, updateBugTitle] = useState("");
    const [bugDescription, updateBugDescription] = useState("");

    const token = localStorage.getItem('token');
    const dispatch = useDispatch(); 

    const { id } = useParams();

    const titleArea = useRef();
    const descriptionArea = useRef();
    const textAreaBtn = useRef();
    const headlineBtn = useRef();


    const saveTitle = (e) => {
        e.preventDefault();
        console.log('Title saved');
        headlineBtn.current.classList.remove('show-btn');
    }

    const saveDescription = (e) => {
        e.preventDefault();
        console.log('Description saved');
        textAreaBtn.current.classList.remove('show-btn');
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

    useEffect(() => {
        const bugOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch(`/bug/${id}`, bugOptions)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) dispatch(logOutUser());
    
            if(data.authenticated === true) {
                updateBugDetails(data.bug[0]);
                updateBugTitle(data.bug[0].bug_name);
                updateBugDescription(data.bug[0].bug_description);
            }
    
        });
    }, []);

    return (
        <>
        <Header />
        <div className="bug-card">
          
            <form>
              <div className="form-group">
                <input onFocus={showTitleBtn} ref={titleArea} className="form-control" value={bugTitle} onChange={e => updateBugTitle(e.target.value)}></input>
                <button ref={headlineBtn} onClick={saveTitle} className="form-control bug-title-save">Save</button>
              </div>
                
              <div className="form-group">
                <textarea onFocus={showDescBtn} ref={descriptionArea} className="form-control" value={bugDescription} onChange={e => updateBugDescription(e.target.value)}></textarea>
                <button ref={textAreaBtn} onClick={saveDescription} className="form-control bug-desc-save">Save</button>
              </div>
            </form>
            
        </div>
        </>
    )
}

export default Bug;