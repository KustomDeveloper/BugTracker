import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from '../actions';
import { useParams } from "react-router-dom";

const BugImg = ({bugId}) => {
    const [bugScreenshots, updateBugScreenshots] = useState([]);

    const dispatch = useDispatch(); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        //get images
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
        };

        fetch(`/bug-images/${bugId}`, options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
                const imageArray = data.images.bug_img;
                const images = [];

                imageArray.forEach(item => {
                    images.push(item[0])
                })

                updateBugScreenshots(images);
            }
            
        });
    }, [])

    const deleteScreenshot = (e) => {
        const url = e.target.getAttribute('img-data');  

        console.log(url)

    }
    
    return(
        <>
        {bugScreenshots ? bugScreenshots.map((img, key) => 
            <div key={key} className="screenshot-container"><img className="bug-screenshot"  src={img} /><a img-data={img} onClick={e => deleteScreenshot(e)} className="image-close-btn"></a></div>
        ) : null}
            
        </>
    )
}

export default BugImg;