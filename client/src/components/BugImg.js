import React, {useEffect, useState, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from '../actions';
import { useParams } from "react-router-dom";
import LightBox from "./LightBox";

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

                updateBugScreenshots(imageArray);

            }
            
        });
    }, [])

    const deleteScreenshot = (e, bugId) => {
        e.preventDefault();
        console.log(bugId)

        const url = e.target.getAttribute('img-data');  

        let isConfirmed = window.confirm("Are you sure you want to delete this Screenshot?");
 
        if(isConfirmed === true) {
            const options = {
                method: 'Delete',
                headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ url : url, id : bugId })
            };
        
            fetch('/delete-screenshot', options)
            .then(response => response.json())
            .then(data => { 
                if(data.authenticated === false) {
                    dispatch(logOutUser());
                }
        
                if(data.authenticated === true) {
                    window.location.reload(false);
                }
            });
        }

    }

    const downloadImg = (e) => {
        const href = e.target.getAttribute('img-data');
        var img = href.split('/').pop();
        console.log(img)


        const options = {
            method: 'GET',
            headers: { "Authorization" : `Bearer ${token}` },
        };
    
        fetch(`/download-img/${img}`, options)
        .then(response => response.blob())
        .then(blob => { 
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = img;
            document.body.appendChild(a);
            a.click();  
            a.remove();
        });
    }
 
    return(
        <>
        {bugScreenshots ? bugScreenshots.map((img, key) => 
            <div key={key} className="screenshot-container"><LightBox src={img}><img className="bug-screenshot"  src={img} /></LightBox><div className="photo-controls"><div className="photo-btns"><span img-data={img} onClick={(e) => downloadImg(e)} className="image-download-btn">Download</span><span img-data={img} onClick={e => deleteScreenshot(e, bugId)} className="image-delete-btn">Delete</span></div></div></div>
        ) : null}
            
        </>
    )
}

export default BugImg;