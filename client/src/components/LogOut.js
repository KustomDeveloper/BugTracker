import React from "react";
import { useDispatch } from 'react-redux';
import {logOutUser} from '../actions';

const LogOut = () => {
    const dispatch = useDispatch(); 

    const handleClick = (e) => {
        localStorage.removeItem('token');
        dispatch(logOutUser());
    }

    return(
        <button onClick={e => handleClick(e)}>Log Out</button>
    ) 
}

export default LogOut