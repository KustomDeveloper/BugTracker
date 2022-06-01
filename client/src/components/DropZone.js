import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const DropZone = () => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles)
  }, [])

  const {
      getRootProps, 
      getInputProps, 
      isDragActive
  } = useDropzone(
      {  onDrop  }
  )

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="dropzone-text">Drop It!</p> :
          <p className="dropzone-text">Drag 'n' drop images here... <br/><small>.png or .jpg only</small></p>
      }
    </div>
  )
}

export default DropZone;