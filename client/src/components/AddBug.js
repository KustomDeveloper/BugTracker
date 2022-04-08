import React, {useState} from "react";
import PopUpForm from "./PopUpForm";

const AddBug = ({allUsers, updateAllUsers, allProjects, updateAllProjects}) => {
    const [showModal, updateShowModal] = useState(false);

    const handleClick = () => {
        updateShowModal(true);
    }
    
    return(
        <>
        <button onClick={e => handleClick(e)} className="submit-bug">Add Bug</button>
        {showModal ? <PopUpForm allUsers={allUsers} updateAllUsers={updateAllUsers} allProjects={allProjects} updateAllProjects={updateAllProjects} showModal={showModal} updateShowModal={updateShowModal}  /> : null}
        </>
    )
}

export default AddBug;