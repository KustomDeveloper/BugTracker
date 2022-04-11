import React, {useEffect, useState} from 'react';
import Logo from './Logo';
import AddBug from './AddBug';
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from '../actions';

const Authorized = () => {
  const token = localStorage.getItem('token');
  const isLoggedIn = useSelector(state => state.auth);
  const username = useSelector(state => state.user);
  const dispatch = useDispatch(); 
  const [tabSelected, updateTabSelected] = useState("");
  const [allProjects, updateAllProjects] = useState("");
  const [allUsers, updateAllUsers] = useState("");
  const [allBugs, updateAllBugs] = useState("");

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
  }, [allBugs])

  useEffect(() => {
    //GET USERS
    const userOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
    };

    fetch('/users', userOptions)
    .then(response => response.json())
    .then(data => { 
        if(data.authenticated === false) return // Redirect user if not logged in -> use state -> isLoggedIn?

        if(data.authenticated === true) {
            updateAllUsers(data.users);
        }

    });
  }, [])

  return(
    <div className="dashboard row h-100">
      <AddBug allUsers={allUsers} updateAllUsers={updateAllUsers} allProjects={allProjects} updateAllProjects={updateAllProjects}/>
      <div className="col col-md-3 col-left">
        <Logo />
        <h2>My Space</h2>
        <hr />

        <ul className="screen-options">
          <li className="selected"><i className="fa fa-bug" aria-hidden="true"></i> Bugs</li>
        </ul>

        <button className="settings">Settings</button>

      </div>
      <div className="col col-md-3 col-mid"> 
        <input className="search" type="search" placeholder="Search by name, Bugs or Other" />
        <hr/>
        <h3>PROJECTS</h3>
        <ul className="projects">
          <li className="selected project-head">My Projects<span className="project-count">{allProjects.length}</span></li>
            <ul>
            { allProjects ? allProjects.map((item, key) => 
            <li className="project-item" key={key}>{item.project_name}</li>) 
            : null }
            </ul>
        </ul>

      </div>

      <div className="col col-md-6 col-right">
      <h1>My Bugs</h1>
        <hr />
        <div className="overview">
          <div className="grid-item open-bugs"><span className="count">36</span>Open Bugs</div>
          <div className="grid-item closed-bugs"><span className="count">09</span>Closed Bugs</div>
          <div className="grid-item overdue-bugs"><span className="count">12</span>Overdue</div>
          <div className="grid-item due-today"><span className="count">18</span>Due Today</div>
          <div className="grid-item due-in-a-week"><span className="count">08</span>Due in 7 Days</div>
        </div>
        <hr />

        <table className="status">
          <thead>
            <tr>
              <th><h3>BUG</h3></th>
              <th><h3>STATUS</h3></th>
              <th><h3>CREATED</h3></th>
              <th><h3>DUE</h3></th>
              <th><h3>ASSIGNED TO</h3></th>
            </tr>
          </thead>
          <tbody>

              { allBugs.length >= 1 ? allBugs.filter((bug) => bug.assigned_to === username.value && bug.project_name === "First Project").map((item, key) => 
              <tr key={key}>
                <td>{item.bug_name}</td>
                <td>{item.status}</td>
                <td>{item.created_date}</td>
                <td>{item.due_date}</td>
                <td>{item.assigned_to}</td>
              </tr>
              ) : null }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Authorized