import React from "react"
import logo from '../img/BugTracker.png';

const Header = () => {

  return(
      <div className="header">
        <div className="logo"><img src={logo} /></div>
      </div>
  )
}

export default Header