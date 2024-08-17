import { SuccessModal } from "../utils/Modal";
// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";

const id = `${process.env.REACT_APP_CLIENT_ID}`;
const secret = `${process.env.REACT_APP_CLIENT_SECRET}`;
var myHeaders = new Headers();
myHeaders.append("client_id", id);
myHeaders.append("client_secret", secret);
myHeaders.append("Content-Type", "application/json");
export async function getRegionsData() {
  try {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/regions`,
      requestOptions
    );
    const json = await response.json();
    var remapped = json.map((region) => {
      return {
        value: region.RegionName ? region.RegionName : undefined,
        label: region.RegionName ? region.RegionName : undefined,
      };
    });
    remapped = remapped.filter((e) => e.value !== undefined);
    remapped = remapped.sort((a, b) => a.label.localeCompare(b.label));
    return remapped;
  } catch (error) {
    const error_modal = {
      modal_title: "Server error [500]",
      modal_text: `An error has occurred while fetching the regions names. Please try again later. If this persists, please contact us.`,
      modal_confirm_button: "OK",
    };
    SuccessModal(
      error_modal,
      "error",
      () =>
        (window.top.location.href = "https://scoresu.org/coach-registration")
    );
  }
}
export async function getWaiver() {
  try {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/waiver?region=Other`,
      requestOptions
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error", error);
  }
}

export async function getSchoolData(regionName) {
  try {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/regions/${regionName}/schoolsites`,
      requestOptions
    );
    const json = await response.json();
    var remapped = json.map((school) => {
      return {
        value: school.Name ? school.Name : undefined,
        label: school.Name ? school.Name : undefined,
        id: school.Name ? school.Id : undefined,
      };
    });
    remapped = remapped.filter((e) => e);
    remapped = remapped.sort((a, b) => a.label.localeCompare(b.label));
    return remapped;
  } catch (error) {
    const error_modal = {
      modal_title: "Server error [500]",
      modal_text: `An error has occurred while fetching the schools names. Please try again later. If this persists, please contact us.`,
      modal_confirm_button: "OK",
    };
    SuccessModal(
      error_modal,
      "error",
      () =>
        (window.top.location.href = "https://scoresu.org/coach-registration")
    );
  }
}

export async function fetchContactInfo(param) {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const response = await fetch(
    `${process.env.REACT_APP_BASEURL}/contacts/${param.ContactId}`,
    requestOptions
  );
  const json = await response.json();
  return json;
}

export async function handleSubmitTypeform(response, stopLoading) {
  // console.log("param", response);
  // dayjs.extend(advancedFormat);
  // dayjs.extend(utc);
  // dayjs.extend(timezone);
  // let timeZone = dayjs()
  //   .format("z")
  //   .toString()
  //   .replace(/\d+/g, "")
  //   .replace(/[^\w\s]/gi, "");
  const form_id = `${process.env.REACT_APP_TYPEFORM_FORM_ID}`;
  const confirmedRegistration = () => {
    window.top.location.href = "https://scoresu.org/coach";
  };
  const confirmedError = () => {
    window.top.location.href = "https://scoresu.org/coach/coach-registration";
  };
  try {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const responsee = await fetch(
      `${process.env.REACT_APP_BASEURL}/typeform/responses?formId=${form_id}&responseId=${response.responseId}`,
      requestOptions
    );
    //const json = await responsee.json();
    //const coachInfo = await fetchContactInfo(json);
    // const waiverData = {
    //   waiverResponse: "Acceptance",
    //   datetime: dayjs().format("YYYY-MM-DDTHH:mm:ss") + timeZone,
    //   contactId: coachInfo[0].Id,
    //   contactEmail: coachInfo[0].PersonalEmail,
    // };
    // console.log(waiverData);
    // var requestOptionsWaiver = {
    //   method: "POST",
    //   headers: myHeaders,
    //   redirect: "follow",
    //   body: JSON.stringify(waiverData),
    // };
    if (responsee.status === 200) {
      stopLoading();
      const register_modal_success = {
        modal_title: "Successful modification",
        modal_text: `Your information has been successfully modified.<br /><b style="font-size:17px;" align="center">Remember to download our app to start taking attendance.<br /><br /><a target="_parent" href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180"
      height="70" /></a> <a target="_parent" href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
      height="70" /></a></b>`,

        modal_confirm_button: "DONE",
      };
      SuccessModal(register_modal_success, "success", confirmedRegistration);
      //   await fetch(
      //     `${process.env.REACT_APP_BASEURL}/waiver/${waiverInfo.waiverId}`,
      //     requestOptionsWaiver
      //   ).then((response) => {
      //     if (response.status === 200) {
      //     } else {
      //       const error_modal = {
      //         modal_title: "Server error [500]",
      //         modal_text: `An error has occurred while saving the waiver acceptance. Please try again later. If this persists, please contact us.`,
      //         modal_confirm_button: "OK",
      //       };
      //       SuccessModal(error_modal, "error", confirmedError);
      //     }
      //   });
      //   const register_modal_success = {
      //     modal_title: "Successful registration",
      //     modal_text: `You have been successfully registered.<br /><b style="font-size:17px;" align="center">Download our app to start taking attendance.<br /><br /><a target="_parent" href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180"
      // height="70" /></a> <a target="_parent" href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
      // height="70" /></a></b>`,

      //     modal_confirm_button: "DONE",
      //   };
      //   SuccessModal(register_modal_success, "success", confirmedRegistration);
      // }
    }
  } catch (error) {
    const error_modal = {
      modal_title: "Server error [500]",
      modal_text: `There is an issue with our server. If this persists, please contact us.`,
      modal_confirm_button: "OK",
    };
    SuccessModal(error_modal, "error", confirmedError);
    console.log("error", error);
  }
}
