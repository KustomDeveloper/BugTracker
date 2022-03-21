import React, {useState} from "react";
import PopUpForm from "./PopUpForm";

const AddBug = () => {
    const [showModal, updateShowModal] = useState(false);

    const handleClick = () => {
        updateShowModal(true);
    }
    
    return(
        <>
        <button onClick={e => handleClick(e)} className="submit-bug">Submit Bug</button>
        {showModal ? <PopUpForm showModal={showModal} updateShowModal={updateShowModal}  /> : null}
        </>
    )
}

export default AddBug;