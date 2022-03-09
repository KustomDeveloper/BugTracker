import React, {useState} from "react";

const PopUpForm = () => {

    const [projectName, setProjectName] = useState("");
    const [projectOwner, setProjectOwner] = useState("");

    const createProjectForm = () => {
        console.log('Form sent!')
    }
    return (
        <>
        <div className="popup">
            {/* Create Project if project does not exist */}
            <form onSubmit={createProjectForm}>
                <input type="text" name="project_name" value="1" />
                <input type="text" name="project_owner" value="2" />

                <input type="submit" name="project_submit" value="Create Project" />
            </form>

        </div>
        </>
    )
}

export default PopUpForm