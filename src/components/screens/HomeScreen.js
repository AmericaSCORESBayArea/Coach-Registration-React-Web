import { useState, useEffect } from "react";
import { Widget } from "@typeform/embed-react";
import { SuccessModal } from "../utils/Modal";

export default function HomeScreen() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight - 300);
  const form_id = `${process.env.REACT_APP_TYPEFORM_FORM_ID}`;
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight - 300);
  };
  const confirmedRegistration = () => {
    window.parent.location.open("https://scoresu.org/coach", "_self");
  };
  const handleSubmit = (response) => {
    const register_modal_success = {
      modal_title: "Successful registration",
      modal_text: `You have been successfully registered.<br /><b style="font-size:17px;" align="center">Download our app to start taking attendance.<br /><br /><a href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180" 
      height="70" /></a> <a href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
      height="70" /></a></b>`,

      modal_confirm_button: "DONE",
    };
    SuccessModal(register_modal_success, "success", confirmedRegistration);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <div>
      <Widget
        id={form_id}
        height={height}
        width={width}
        className="my-form"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
