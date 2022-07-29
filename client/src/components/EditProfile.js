import React, {useEffect, useState, useRef} from "react";
import { logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropZone from "./ProfileDropZone";


const EditProfile = () => {

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

                console.log(user)

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

        // const options = {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
        //     body: JSON.stringify({ title: e.target.value, id: id })
        // };
    
        // fetch('/update-profile-firstname/', options)
        // .then(response => response.json())
        // .then(data => { 
        //     if(data.authenticated === false) {
        //         dispatch(logOutUser());
        //     }
    
        //     if(data.authenticated === true) {
        //         // console.log(data.message)
        //     }
    
        // });
    }

    const saveLastname = (e) => {
        e.preventDefault();

        setLastname(e.target.value);
    }

    const saveUsername = (e) => {
        e.preventDefault();

        setLastname(e.target.value);
    }

    const saveEmail = (e) => {
        e.preventDefault();

        setEmail(e.target.value);
    }

return(
    <form className="edit-profile" encType="multipart/form-data">
    
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
        <input type="text" className="form-control" value={username} onChange={e => saveUsername(e) }></input>
    </div>
    <div className="form-group">
        <h3>Email Address</h3>
        <input type="email" className="form-control" value={email} onChange={e => saveEmail(e) }></input>
    </div>

    <div className="form-group">
        <h3>Profile Image</h3>
        <ProfileDropZone />
    </div>

</form>
)

}

export default EditProfile;