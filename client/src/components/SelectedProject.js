
import React from "react";

const SelectedProject = ({allBugs, username, tabSelected}) => {

    return(
    allBugs.filter((bug) => bug.assigned_to === username.value && bug.project_name === tabSelected).map((item, key) => 
    <tr className="selected-item" key={key}>
      <td>{item.bug_name}</td>
      <td>{item.status}</td>
      <td>{item.due_date}</td>
      <td>{item.assigned_to}</td>
    </tr>
    )
    )
  }

  export default SelectedProject;