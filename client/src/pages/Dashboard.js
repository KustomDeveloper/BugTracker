import React, { useEffect, useState }  from "react";
import Authorized from '../components/Authorized';
import Unauthorized from '../components/Unauthorized';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import {logInUser, setUsername} from '../actions';


const Dashboard = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Authorization" : `Bearer ${token}` },
        };

        fetch('/dashboard', requestOptions)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) return
                if(data.authenticated === true) {
                    dispatch(logInUser());
                    dispatch({type: "ADDUSERNAME", payload: data.username});
                }
            });

    }, [])

    return(
        <>
        {isLoggedIn === true ? <Authorized /> : <Unauthorized />}
        </>
    )
}

export default Dashboard;