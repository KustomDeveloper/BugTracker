import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropZone from "./ProfileDropZone";


const EditProfile = ({avatar}) => {

    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const token = localStorage.getItem('token');
    const { id } = useParams();

    //Get Current User
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch(`/current-user`, options)
        .then(response => response.json())
        .then(data => {
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                let user = data.user;

                setFirstname(user[0].firstname);
                setLastname(user[0].lastname);
                setUsername(user[0].username);
                setEmail(user[0].email);
            }
    
        });
    }, []);

    const saveFirstname = (e) => {
        e.preventDefault();

        setFirstname(e.target.value);

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ firstName: e.target.value })
        };
    
        fetch('/update-profile-firstname/', options)
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

    const saveLastname = (e) => {
        e.preventDefault();

        setLastname(e.target.value);

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
            body: JSON.stringify({ lastName: e.target.value })
        };
    
        fetch('/update-profile-lastname/', options)
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

    const deleteProfile = (e) => {
        e.preventDefault();

        let isConfirmed = window.confirm("Are you sure you want to delete this account?");
 
        if(isConfirmed === true) {

            const options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ username: username })
            };

            fetch('/delete-profile/', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    dispatch(logOutUser());
                }
        
            });
        }
    }




return(
    <form className="edit-profile" encType="multipart/form-data">

    <div><button className="delete-profile" onClick={e => deleteProfile(e)}>Delete Profile</button></div>
    
    <div className="form-group">
        <h3>First Name</h3>
        <input type="text" className="form-control" value={firstName} onChange={e => saveFirstname(e) }></input>
    </div>
    <div className="form-group">
        <h3>Last Name</h3>
        <input type="text" className="form-control" value={lastName} onChange={e => saveLastname(e) }></input>
    </div>
    <div className="form-group">
        <h3>Username</h3>
        <input type="text" style={{color: '#ccc', background: '#fff'}} className="form-control" defaultValue={username} readOnly></input>
    </div>
    <div className="form-group">
        <h3>Email Address</h3>
        <input type="email" style={{color: '#ccc', background: '#fff'}} className="form-control" defaultValue={email} readOnly></input>
    </div>

    {avatar ? '' : 
        <div className="form-group">
            <h3>Profile Image <em><small>NOTE: Image must be 150px x 150px</small></em></h3>
            <ProfileDropZone />
        </div>
    }

</form>
)

}

export default EditProfile;