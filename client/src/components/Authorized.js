import React, {useEffect, useState} from 'react';
import Logo from './Logo';
import AddBug from './AddBug';
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from '../actions';
import AllProjects from './AllProjects';
import SelectedProject from './SelectedProject';
import Search from './Search';
import { Link } from 'react-router-dom';

const Authorized = () => {
  const token = localStorage.getItem('token');
  const isLoggedIn = useSelector(state => state.auth);
  const username = useSelector(state => state.user);
  const dispatch = useDispatch(); 
  
  const [tabSelected, updateTabSelected] = useState("allprojects");
  const [allProjects, updateAllProjects] = useState("");
  const [allUsers, updateAllUsers] = useState("");
  const [allBugs, updateAllBugs] = useState([]);


  useEffect(() => {
    //GET PROJECTS
    const projectOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
    };

    fetch('/projects', projectOptions)
    .then(response => response.json())
    .then(data => { 

        if(data.authenticated === false) dispatch(logOutUser());

        if(data.authenticated === true) {
            updateAllProjects(data.projects);
        }

    });

  }, [])

  useEffect(() => {
    //GET BUGS
    const bugOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
    };

    fetch('/bugs', bugOptions)
    .then(response => response.json())
    .then(data => { 
        if(data.authenticated === false) dispatch(logOutUser());

        if(data.authenticated === true) {
            updateAllBugs(data.bugs);
        }

    });
    
  }, [])

  useEffect(() => {
    //GET USERS
    const userOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
    };

    fetch('/users', userOptions)
    .then(response => response.json())
    .then(data => { 
        if(data.authenticated === false) dispatch(logOutUser());

        if(data.authenticated === true) {
            updateAllUsers(data.users);
        }

    });

  }, [])

  const countAllBugs = (bugs, username) => {
    const newArray = bugs.filter(bug => bug.assigned_to === username.value && bug.status != 'complete')

    return newArray.length;
  }

  const overdueBugs = (bugs, username) => {
    //get todays date in correct format
    let today = new Date();
    today = today.toISOString();
    today = today.substr(0,10);

    const myBugs = bugs.filter(bug => bug.assigned_to === username.value && bug.due_date.substr(0,10) < today && bug.status != 'complete');

    return myBugs.length;
  }

  const dueTodayBugs = (bugs, username) => {
    //get todays date in correct format
    let today = new Date();
    today = today.toISOString();
    today = today.substr(0,10)
    const myBugs = bugs.filter(bug => bug.assigned_to === username.value && bug.due_date.substr(0,10) === today && bug.status != 'complete');

    return myBugs.length;
  }

  return(
    <div className="dashboard row h-100">
        
      <AddBug allUsers={allUsers} updateAllUsers={updateAllUsers} allProjects={allProjects} updateAllProjects={updateAllProjects}/>
      <div className="col col-md-3 col-left">
        <Logo /> <button onClick={() => dispatch(logOutUser())} className="logout-btn"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</button>
        <h2>My Space</h2>
        <hr />

        <ul className="screen-options">
          <li className="selected"><i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard</li>
        </ul>

        <button className="settings"><Link to='/profile'>Settings</Link></button>

      </div>
      <div className="col col-md-3 col-mid"> 
        <div className="search-container"><Search /></div>
        <hr/>
        <h3>PROJECTS</h3>
        <ul className="projects">
          <li onClick={e => updateTabSelected('allprojects')} className="selected project-head">All Projects<span className="project-count">{allProjects.length}</span></li>
            <ul>
            { allProjects ? allProjects.map((item, key) => 
            <li onClick={e => updateTabSelected(e.target.innerHTML)} className={tabSelected === item.project_name ? "project-item selected" : "project-item"} key={key}>{item.project_name}</li>) 
            : null }
            </ul>
        </ul>

      </div>

      <div className="col col-md-6 col-right">
      <h1>My Bugs</h1>
        <hr />
        <div className="overview">
          <div className="grid-item open-bugs"><span className="count">{allBugs.length > 0 ? countAllBugs(allBugs, username) : '0' }</span>Total Bugs</div>
          <div className="grid-item overdue-bugs"><span className="count">{allBugs.length > 0 ?  overdueBugs(allBugs, username) : '0' }</span>Overdue</div>
          <div className="grid-item due-today"><span className="count">{allBugs.length > 0 ?  dueTodayBugs(allBugs, username) : '0' }</span>Due Today</div>
          {/* <div className="grid-item due-in-a-week"><span className="count">08</span>Due this week</div> */}
        </div>
        <hr />

        <table className="status">
          <thead>
            <tr>
              <th><h3>OPEN BUGS</h3></th>
              <th><h3>STATUS</h3></th>
              <th><h3>DUE</h3></th>
              <th><h3>ASSIGNED TO</h3></th>
            </tr>
          </thead>
         

            {tabSelected === "allprojects" && allBugs.length >= 1 ? <AllProjects allBugs={allBugs} username={username} tabSelected={tabSelected} /> : null }

            {tabSelected === tabSelected && allBugs.length >= 1 ? <SelectedProject allBugs={allBugs} username={username} tabSelected={tabSelected}  /> : null }

    
        </table>
      </div>

    </div>
  )
}

export default Authorized