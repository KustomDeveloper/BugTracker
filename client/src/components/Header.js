import React from "react"
import logo from '../img/BugTracker.png';
import { useSelector } from 'react-redux';
import LogOut from "./LogOut";
import LogIn from "./LogIn";

const Header = () => {
  const isLoggedIn = useSelector(state => state.auth);

  return(
      <div className="header">
        <div className="logo"><img src={logo} /></div>
        {/* {isLoggedIn ? <LogOut/> : <LogIn/> } */}
      </div>
  )
}

export default Header