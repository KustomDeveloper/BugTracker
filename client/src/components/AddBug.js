import React, {useState} from "react";
import PopUpForm from "./PopUpForm";

const AddBug = () => {
    const [popup, setPopup] = useState(false);

    const handleClick = () => {
        setPopup(true);
    }
    
    return(
        <>
        <button onClick={e => handleClick(e)} className="submit-bug">Submit Bug</button>
        {popup ? <PopUpForm /> : null}
        </>
    )
}

export default AddBug;