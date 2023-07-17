import { useState, useEffect } from "react";
import { Widget } from "@typeform/embed-react";
import Loading from "../utils/Loading";
import WaiverComponent from "../utils/WaiverComponent";
import { handleSubmitTypeform } from "../api/api";
export default function HomeScreenNewCoach(props) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight - 260);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [waiverInfo, setWaiverInfo] = useState({
    name: "",
    waiverResponse: "",
    date: "",
    time: "",
    contactId: "",
    contactEmail: "",
    waiverId: "",
  });

  const form_id = `${process.env.REACT_APP_TYPEFORM_FORM_ID}`;
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight - 260);
  };

  const handleSubmit = (response) => {
    setLoading(true);
    if (response.responseId)
      handleSubmitTypeform(response, waiverInfo, () => setLoading(false));
  };

  const AcceptWaiver = (data) => {
    setWaiverInfo((prev) => ({
      ...prev,
      name: data.Name,
      waiverResponse: "Acceptance",
      date: "",
      time: "",
      contactId: "",
      contactEmail: "",
      waiverId: data.WaiverId,
    }));
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : show === true ? (
        <WaiverComponent
          confirmButton="Accept"
          addWaiverData={AcceptWaiver}
          function={() => setShow(false)}
        />
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
