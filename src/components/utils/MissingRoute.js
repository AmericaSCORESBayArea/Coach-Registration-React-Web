import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function MissingRoute() {
  const showToast = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  showToast("Error 404. Page not found.");
  return <Navigate to={{ pathname: "/" }} />;
}

export { MissingRoute };
