import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import Button from "@mui/material/Button";
import Loading from "../utils/Loading";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWaiver } from "../api/api";

export default function WaiverComponent(props) {
  const [waiverData, setWaiverData] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let response = await getWaiver();
      setWaiverData(response);
      props.addWaiverData(response[0]);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (!loading) {
      let myDiv = "";
      myDiv = document.getElementById("myDiv");
      myDiv.innerHTML = waiverData[0].Content;
      myDiv.innerHTML = myDiv.textContent;
    }
  }, [loading]);
  return (
    <div id="container">
      {loading ? (
        <Loading />
      ) : (
        <Modal
          backdrop="static"
          fullscreen={"lg-down"}
          show={show}
          onHide={() => {
            setShow(false);
            props.function();
          }}
        >
          <Modal.Header closeButton={props.deniedButton ? true : false}>
            <Modal.Title>Waiver / Waivers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <article
              className="markdown-body entry-content container-lg w-100"
              itemProp="text"
            >
              <h1 id="waiverTitle">Waiver</h1>
              <div id="myDiv" />
            </article>
          </Modal.Body>
          <Modal.Footer>
            {props.deniedButton && (
              <Button
                size={"medium"}
                variant="contained"
                onClick={() => {
                  setShow(false);
                  props.function();
                  props.checkboxFunction("waiver", false);
                }}
                style={{
                  marginRight: "2%",
                  backgroundColor: "#5c6370",
                }}
              >
                {props.deniedButton}
              </Button>
            )}
            <Button
              size={"medium"}
              variant="contained"
              onClick={() => {
                setShow(false);
                props.function();
                if (props.deniedButton) props.checkboxFunction("waiver", true);
              }}
            >
              {props.confirmButton}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
