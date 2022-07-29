import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logOutUser } from '../actions';


const ProfileDropZone = () => {
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const dispatch = useDispatch(); 


    const onDrop = useCallback(acceptedFiles => {
        const data = new FormData();

        data.append('id', id);
        data.append('path', acceptedFiles[0].path);
        data.append('screenshot', acceptedFiles[0]);

        // Do something with the files
        const options = {
            method: 'POST',
            headers: { 'Enc-Type': 'multipart/form-data', "Authorization" : `Bearer ${token}` },
            body: data
        }
    
        fetch('/profile-img-upload/', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) {
                dispatch(logOutUser());
            }
    
            if(data.authenticated === true) {
              window.location.reload(false);
            }
        });

    }, [])

    const {
        maxSize,
        acceptedFiles,
        fileRejections,
        getRootProps, 
        getInputProps, 
        isDragActive
    } = useDropzone({ 
        onDrop,
        accept: {
            'image/png': [],
            'image/jpg': [],
            'image/jpeg': []
        },
        minSize: 0,
        //5 megabytes max upload
        maxSize: 5242880
    })

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.path}>
      <ul className="dropzone-errors">
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div className="dropzone" {...getRootProps()}>
      <input name="screenshot" {...getInputProps()} />
      {
        isDragActive ?
          <p className="dropzone-text">Drop it like it's hot!</p> :
          <p className="dropzone-text">Drag 'n' drop images here... <br/><small><em>.png or .jpg only</em></small></p>
      }
      <div><ul>{fileRejectionItems}</ul></div>
    </div>
  )
}

export default ProfileDropZone;