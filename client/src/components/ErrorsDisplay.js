import React from "react";

const ErrorsDisplay = (el, key) => {
    return(
        <>
        {/* {console.log(el, key)} */}
          <div key={key}>{el}</div>
        </>
    ) 
}

export default ErrorsDisplay;