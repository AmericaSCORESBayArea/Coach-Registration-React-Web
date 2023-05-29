import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/America-SCORES-Logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import firebase from "../../firebase/firebaseConfig";
import { ModalwithConfirmation } from "./Modal";
import Cookies from "js-cookie";

function NavbarComponent(props) {
  const history = useNavigate();
  const confirmedLogout = () => {
    firebase.auth().signOut();
    Cookies.set("coach_user", false);
    history({ pathname: "/Login" });
  };

  const showLogoutModal = () => {
    const logout_modal = {
      modal_title: "Are you sure you want to log out?",
      modal_text: "Any changes made will not be saved.",
      modal_cancel_button: "CANCEL",
      modal_confirm_button: "LOG OUT",
    };
    ModalwithConfirmation(logout_modal, confirmedLogout, "warning");
  };
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <img
            src={logo}
            style={{
              width: "100%",
              maxWidth: "250px",
            }}
            className="d-inline-block align-top"
            alt=""
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {JSON.parse(localStorage.getItem("coach_user")) === true ? (
            <IconButton
              size="large"
              color="primary"
              aria-label="LogOut"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                showLogoutModal();
              }}
            >
              <LogoutIcon fontSize="large" />
            </IconButton>
          ) : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
