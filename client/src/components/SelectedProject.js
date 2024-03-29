
import React from "react";
import { Link } from 'react-router-dom';

// Convert Date
const convertDate = (date) => {
  const convertedDate = new Date(date);
  return + (convertedDate.getMonth()+1) + '-' + convertedDate.getDate() + '-' + convertedDate.getFullYear(); 
}

const SelectedProject = ({allBugs, username, tabSelected})  => {

    return(
    <>
    <tbody>
      {allBugs.filter((bug) => bug.assigned_to === username.value && bug.project_name === tabSelected && bug.status != 'complete').map((item, key) => 
      <tr className="selected-item" key={key}>
        <td><Link to={`/bug/${item._id}`}>{item.bug_name}</Link></td>
        <td>{item.status}</td>
        <td>{convertDate(item.due_date)}</td>
        <td>{item.assigned_to}</td>
      </tr>
      
      )}
    </tbody>
  </>
     )
  }

  export default SelectedProject;

