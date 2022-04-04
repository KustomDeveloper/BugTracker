import React, {useState} from "react";
import PopUpForm from "./PopUpForm";

const AddBug = ({allProjects, updateAllProjects}) => {
    const [showModal, updateShowModal] = useState(false);

    const handleClick = () => {
        updateShowModal(true);
    }
    
    return(
        <>
        <button onClick={e => handleClick(e)} className="submit-bug">Submit Bug</button>
        {showModal ? <PopUpForm allProjects={allProjects} updateAllProjects={updateAllProjects} showModal={showModal} updateShowModal={updateShowModal}  /> : null}
        </>
    )
}

export default AddBug;