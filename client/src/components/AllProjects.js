
import React from "react";

const AllProjects = ({allBugs, username, tabSelected}) => {

    return(
    allBugs.filter((bug) => bug.assigned_to === username.value && tabSelected === "allprojects").map((item, key) => 
    <tr className="selected-item" key={key}>
      <td>{item.bug_name}</td>
      <td>{item.status}</td>
      <td>{item.due_date}</td>
      <td>{item.assigned_to}</td>
    </tr>
    )
    )
  }

  export default AllProjects;