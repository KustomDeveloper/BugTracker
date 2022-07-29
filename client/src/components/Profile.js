import React, {useEffect, useState, useRef} from "react";
import { logInUser, logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import Logo from "./Logo";

const Profile = () => {
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { id } = useParams();

    const [logInStatus, setLoginStatus] = useState(true);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch('/check-login-status', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                setLoginStatus(false);
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                dispatch(logInUser());
            }
    
        });
       
    }, [setLoginStatus])

    const redirectToLoginForm = () => {
        navigate('/');
    }

    return (
 
        <div className="dashboard row h-100 bug-single-dashboard">
            <div className="col col-md-3 col-left">
                <Logo />
                <h2>My Profile</h2>
                <hr />

                <ul className="screen-options">
                    <Link to="/dashboard"><li className="unselected"><i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard</li></Link>
                    <li className="selected"><i className="fa fa-bug" aria-hidden="true"></i> Profile</li>
                </ul>

                <button className="settings"> <Link to="/profile">Settings</Link></button>

            </div>

            <div className="col col-md-3 col-mid bug-single-mid"> 

                <h3 className="project-name-title">Edit your profile</h3>
               

            </div>

            <div className="col col-md-6 col-right">
                <div className="bug-card">
                    {isLoggedIn === true ? <EditProfile /> : redirectToLoginForm()} 
                </div>
            </div>
        </div>
    )
}

export default Profile;