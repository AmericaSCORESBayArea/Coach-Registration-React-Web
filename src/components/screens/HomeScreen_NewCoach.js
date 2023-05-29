import { useState, useEffect } from "react";
import { Widget } from "@typeform/embed-react";
import { SuccessModal } from "../utils/Modal";
import Loading from "../utils/Loading";

export default function HomeScreen_NewCoach() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight - 260);
  const [loading, setLoading] = useState(false);
  const form_id = `${process.env.REACT_APP_TYPEFORM_FORM_ID}`;
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight - 260);
  };
  const confirmedRegistration = () => {
    window.top.location.href = "https://scoresu.org/coach";
    //window.parent.location.open("https://scoresu.org/coach", "_self");
  };
  const confirmedError = () => {
    window.top.location.href = "https://scoresu.org/coach/coach-registration";
    //window.parent.location.open("https://scoresu.org/coach", "_self");
  };
  const handleSubmit = async (response) => {
    setLoading(true);
    const id = `${process.env.REACT_APP_CLIENT_ID}`;
    const secret = `${process.env.REACT_APP_CLIENT_SECRET}`;
    const form_id = `${process.env.REACT_APP_TYPEFORM_FORM_ID}`;
    var myHeaders = new Headers();
    myHeaders.append("client_id", id);
    myHeaders.append("client_secret", secret);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api/typeform/responses?formId=${form_id}&responseId=${response.responseId}`,
      requestOptions
    )
      .then(() => {
        setLoading(false);
        const register_modal_success = {
          modal_title: "Successful registration",
          modal_text: `You have been successfully registered.<br /><b style="font-size:17px;" align="center">Download our app to start taking attendance.<br /><br /><a target="_parent" href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180" 
        height="70" /></a> <a target="_parent" href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
        height="70" /></a></b>`,

          modal_confirm_button: "DONE",
        };
        SuccessModal(register_modal_success, "success", confirmedRegistration);
      })
      .catch((error) => {
        setLoading(false);
        const error_modal = {
          modal_title: "Server error [500]",
          modal_text: `There is an issue with our server. If this persists, please contact us.`,
          modal_confirm_button: "OK",
        };
        SuccessModal(error_modal, "error", confirmedError);
        console.log("error", error);
      });
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Widget
          id={form_id}
          height={height}
          width={width}
          className="my-form"
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
