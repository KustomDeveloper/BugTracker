import React, {useEffect, useState, useRef} from "react";
import { logInUser, logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import BugForm from "./BugForm";
import Logo from "./Logo";

const Bug = () => {
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [logInStatus, setLoginStatus] = useState(true);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch('/check-login-status', options)
        .then(response => response.json())
        .then(data => { 
            // console.log(data)
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
 
        <div className="dashboard row h-100">
            <div className="col col-md-3 col-left">
                <Logo />
                <h2>My Space</h2>
                <hr />

                <ul className="screen-options">
                    <li className="selected"><i className="fa fa-bug" aria-hidden="true"></i> Bugs</li>
                </ul>

                <button className="settings">Settings</button>

            </div>

            <div className="col col-md-3 col-mid bug-single-mid"> 
                <h2>Project</h2>

            </div>

            <div className="col col-md-6 col-right">
                <div className="bug-card">
                    {isLoggedIn === true ? <BugForm /> : redirectToLoginForm()} 
                </div>
            </div>
        </div>
    )
}

export default Bug;