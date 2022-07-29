import React from "react";
import { Link } from 'react-router-dom';

// Convert Date
const convertDate = (date) => {
  const convertedDate = new Date(date);
  return + (convertedDate.getMonth()+1) + '-' + convertedDate.getDate() + '-' + convertedDate.getFullYear(); 
}

const AllProjects = ({allBugs, username, tabSelected}) => {
  const findCompletedBugs = (bugs) => {
    let filterBugs = bugs;
    let completeBugs = filterBugs.filter((bug) => bug.status === 'complete' && bug.assigned_to === username.value);
  
    return completeBugs.length
  }

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
    
    {findCompletedBugs(allBugs) >= 1 ? <tbody><tr><td><h3 className="complete-title">COMPLETE</h3></td></tr></tbody> : null}

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