import React from "react";
import Box from "@mui/material/Box";

export default function Loading(props) {
  return (
    <div
      style={{
        position: "fixed",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <img
        style={{
          width: "300px",
          justifyContent: "center",
          verticalAlign: "middle",
          margin: "auto",
          alignSelf: "center",
        }}
        src={require("../../assets/Scores_Logo.gif")}
        alt=""
      />
    </div>
  );
}
