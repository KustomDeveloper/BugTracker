import React from 'react';
import Logo from './Logo';
import AddBug from './AddBug';

const Authorized = () => {
  return(
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
      <div className="col col-md-3 col-mid"> 
        <input className="search" type="search" placeholder="Search by name, Bugs or Other" />
        <hr/>
        <h3>PROJECTS</h3>
        <ul className="projects">
          <li className="selected project-head">My Projects<span className="project-count">3</span></li>
          <li className="project-item">Clinton Project</li>
          <li className="project-item">Dr. Malone</li>
          <li className="project-item">Joe Rogan Podcast</li>
        </ul>


      </div>

      <div className="col col-md-6 col-right">
      <h1>My Bugs</h1>
        <AddBug/>
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
            <tr>
              <td>bug stuff</td>
              <td>status stuff</td>
              <td>created stuff</td>
              <td>due stuff</td>
              <td>assigned stuff</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Authorized