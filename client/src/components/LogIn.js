import React from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        navigate("/");
    }

    return(
        <button onClick={e => handleClick(e)}>Log In</button>
    ) 
}

export default LogIn