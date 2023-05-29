import { useState, useEffect } from "react";
import HomeScreen_NewCoach from "./HomeScreen_NewCoach";
import EditForm from "./EditForm";
import Loading from "../utils/Loading";
export default function HomeScreen() {
  const [newCoach, setNewCoach] = useState(null);
  const [coachData, setCoachData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getContactInfo(phoneNumberProp) {
      phoneNumberProp = phoneNumberProp.slice(2);
      const serviceProvider = "Phone";
      const id = `${process.env.REACT_APP_CLIENT_ID}`;
      const secret = `${process.env.REACT_APP_CLIENT_SECRET}`;
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
        `https://salesforce-auth-api-prod.us-e2.cloudhub.io/api/auth/login?useridentifier=${phoneNumberProp}&serviceprovider=${serviceProvider}`,
        requestOptions
      )
        .then((response) => response.json())
        .then(async (data) => {
          if (data.ContactId === null) {
            setNewCoach(true);
            setLoading(false);
          } else {
            await fetch(
              `https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api/contacts/${data.ContactId}`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => {
                setLoading(false);
                setCoachData(data[0]);
                setNewCoach(false);
              })
              .catch((error) => console.log("error", error));
          }
        })
        .catch((error) => console.log("error", error));
    }
    getContactInfo(localStorage.getItem("coach_phoneNumber"));
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : newCoach === true ? (
        <HomeScreen_NewCoach />
      ) : (
        <EditForm coachProps={coachData} />
      )}
    </div>
  );
}
