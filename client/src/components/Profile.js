import React, {useEffect, useState, useRef} from "react";
import { logInUser, logOutUser } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import Logo from "./Logo";
import DefaultAvatar from "./DefaultAvatar";

const Profile = () => {
    const [avatar, setAvatar] = useState('');
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

    useEffect(() => {
        //get avatar
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
        };

        fetch(`/profile-avatar/`, options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                const avatar = data.userInfo.avatar;

                console.log(avatar)

                setAvatar(avatar);
            }
            
        });
    }, [])

    const deleteAvatar = (e) => {
        e.preventDefault();

        let isConfirmed = window.confirm("Are you sure you want to delete this Avatar?");
 
            if(isConfirmed === true) {

            const options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ avatar: avatar })
            };

            console.log(avatar)
        
            fetch('/delete-avatar', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    window.location.reload(false);
                }
        
            });
        }

    }

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
                {avatar ? <div><img className='avatar-img' src={avatar} /><span onClick={e => deleteAvatar(e)} className='delete-avatar'><i className="fa fa-times-circle-o" aria-hidden="true"></i></span></div> : <DefaultAvatar /> }
                
            </div>

            <div className="col col-md-6 col-right">
                <div className="bug-card">
                    {isLoggedIn === true ? <EditProfile avatar={avatar} /> : redirectToLoginForm()} 
                </div>
            </div>
        </div>
    )
}

export default Profile;