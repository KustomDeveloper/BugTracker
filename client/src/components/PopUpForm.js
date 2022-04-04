import React, {useEffect, useState} from "react";
import CreateBug from "./CreateBug";
import CreateProject from "./CreateProject";
import {motion, AnimatePresence} from 'framer-motion'
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {logInUser} from '../actions';


const PopUpForm = ({ showModal, updateShowModal, allProjects, updateAllProjects }) => {
    const isLoggedIn = useSelector(state => state.auth);


    const backdrop = {
        visible: { opacity: 1},
        hidden: { opacity: 0 }
    }

    const handleChange = (e) => {
      console.log(e)
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
                        <div onClick={e => ClosePopup(e)} className="closeButton">X</div>

                        {allProjects ? <CreateBug allProjects={allProjects} updateAllProjects={updateAllProjects}/> : <CreateProject />}

                      
                    </div>

                </motion.div>
            )}
            
        </AnimatePresence>
    )
}

export default PopUpForm