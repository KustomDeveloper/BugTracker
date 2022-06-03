import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'


const DropZone = () => {

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log(acceptedFiles)
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
      {/* {file.path} - {file.size} bytes */}
      <p>
        {errors.map(e => (
          <span key={e.code}>{e.message}</span>
        ))}
      </p>
    </div>
  ));

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="dropzone-text">Drop It!</p> :
          <p className="dropzone-text">Drag 'n' drop images here... <br/><small><em>.png or .jpg only</em></small></p>
      }
      <div><ul>{fileRejectionItems}</ul></div>
    </div>
  )
}

export default DropZone;