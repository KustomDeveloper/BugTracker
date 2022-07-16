import React, {useEffect, useState} from "react";
import CreateBug from "./CreateBug";
import CreateProject from "./CreateProject";
import {motion, AnimatePresence} from 'framer-motion'
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {logInUser} from '../actions';


const PopUpForm = ({ allUsers, updateAllUsers, showModal, updateShowModal, allProjects, updateAllProjects }) => {
    const isLoggedIn = useSelector(state => state.auth);
    const [showProjectForm, updateShowProjectForm] = useState(false);

    const backdrop = {
        visible: { opacity: 1},
        hidden: { opacity: 0 }
    }

    const ClosePopup = (e) => {
        updateShowModal(false)
    }

    return (
        <AnimatePresence exitBeforeEnter>
            { showModal && (
                <motion.div 
                  className="backdrop"
                  variants={backdrop}
                  initial="hidden"
                  animate="visible">

                    <div className="popup">
                        <div onClick={e => ClosePopup(e)} className="closeButton"><i class="fa fa-times-circle-o" aria-hidden="true"></i></div>

                        {allProjects.length && showProjectForm === false >= 1 ? <CreateBug showProjectForm={showProjectForm} updateShowProjectForm={updateShowProjectForm} allUsers={allUsers} updateAllUsers={updateAllUsers} updateShowModal={updateShowModal} allProjects={allProjects} updateAllProjects={updateAllProjects}/> : <CreateProject showProjectForm={showProjectForm} updateShowProjectForm={updateShowProjectForm} showModal={showModal} updateShowModal={updateShowModal} />}

                      
                    </div>

                </motion.div>
            )}
            
        </AnimatePresence>
    )
}

export default PopUpForm