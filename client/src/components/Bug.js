import React, {useEffect, useState} from "react";
import { logOutUser } from '../actions';
import { useDispatch } from 'react-redux';
import Header from './Header';
import { useParams } from "react-router-dom";

const Bug = () => {
    const [bugDetails, updateBugDetails] = useState([]);
    const [bugDescription, updateBugDescription] = useState("");

    const token = localStorage.getItem('token');
    const dispatch = useDispatch(); 

    const { id } = useParams();

    const saveDescription = () => {
        console.log('saved');
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
                updateBugDescription(data.bug[0].bug_description);
            }
    
        });
    }, []);

    return (
        <>
        <Header />
        <div className="bug-card">
            <h1>{bugDetails.bug_name}</h1>
            {/* <form> */}
              <div className="form-group">
                <textarea className="form-control" value={bugDescription} onChange={e => updateBugDescription(e.target.value)}></textarea>
                <button onClick={saveDescription} className="form-control bug-save">Save</button>
              </div>
            {/* </form> */}
            
        </div>
        </>
    )
}

export default Bug;