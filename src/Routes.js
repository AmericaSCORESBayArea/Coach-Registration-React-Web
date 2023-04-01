import React from "react";
import {
  BrowserRouter as Router,
  Route,
  useNavigate,
  Routes,
} from "react-router-dom";
import HomeScreen from "./components/screens/HomeScreen";
import NavBar from "./components/utils/NavbarComponent";
import { MissingRoute } from "./components/utils/MissingRoute";
import ScrollToTop from "./components/utils/ScrollToTop";
import LogInScreen from "./components/screens/LoginScreen";
import { PagesTitle } from "./components/utils/PagesTitle";
import { PrivateRoute } from "./components/utils/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RoutesWeb() {
  return (
    <div>
      <NavBar />
      <PagesTitle />
      <div>
        <ScrollToTop />
        <Routes history={useNavigate}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
            }
          />
          <Route index path="/Login" element={<LogInScreen />} />
          <Route path="*" element={<MissingRoute />} />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}
