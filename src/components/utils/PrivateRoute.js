import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
export { PrivateRoute };

function PrivateRoute(props) {
  const showToast = (message) => {
    toast.warning(message, {
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
  const user = localStorage.getItem("coach_user");
  const firstTimeUser = sessionStorage.getItem("firstTime_coach");
  if (JSON.parse(user) !== true) {
    if (JSON.parse(firstTimeUser) !== null) {
      showToast(
        "You need to be logged in to access the coach registration form."
      );
    } else {
      sessionStorage.setItem("firstTime_coach", false);
    }
    return <Navigate to="/Login" />;
  }

  // authorized so return child components
  return props.children;
}
