
import React from "react";
import { Link } from 'react-router-dom';

// Convert Date
const convertDate = (date) => {
  const convertedDate = new Date(date);
  return + (convertedDate.getMonth()+1) + '-' + convertedDate.getDate() + '-' + convertedDate.getFullYear(); 
}

const findCompletedBugs = (bugs) => {
  let convertBugs = bugs;
  let completeBugs = convertBugs.filter((bug) => bug.status === 'complete');

  return completeBugs.length
}

const AllProjects = ({allBugs, username, tabSelected}) => {

    return(
    <>
    <tbody>
    {allBugs.filter((bug) => bug.assigned_to === username.value && tabSelected === "allprojects" && bug.status != 'complete').map((item, key) => (
    <tr className="selected-item" key={key}>
      <td><Link to={`/bug/${item._id}`}>{item.bug_name}</Link></td>
      <td>{item.status}</td>
      <td>{convertDate(item.due_date)}</td>
      <td>{item.assigned_to}</td>
    </tr>
    )
    )}
    </tbody>
    
    {allBugs && findCompletedBugs(allBugs) >= 1 ? <th><h3 className="complete-title">COMPLETE</h3></th> : null}

    <tbody>
    {allBugs.filter((bug) => bug.assigned_to === username.value && tabSelected === "allprojects" && bug.status === 'complete').map((item, key) => (
    <tr className="selected-item" key={key}>
      <td><Link to={`/bug/${item._id}`}>{item.bug_name}</Link></td>
      <td>{item.status}</td>
      <td>{convertDate(item.due_date)}</td>
      <td>{item.assigned_to}</td>
    </tr>
    )
    )
    }
    </tbody>
    </>
)}

  export default AllProjects;