import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [])

  return (
      <>
       <h1>Unauthorized</h1>
      </>
  )
}

export default Unauthorized