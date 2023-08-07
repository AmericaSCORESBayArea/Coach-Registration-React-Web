import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { SuccessModal } from "../utils/Modal";
import dayjs from "dayjs";
import { genderArray, ethnicityArray } from "../utils/Arrays.js";
import Select from "react-select";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { blue } from "@mui/material/colors";
import Loading from "../utils/Loading";
import { getRegionsData, getSchoolData } from "../api/api";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
//import WaiverComponent from "../utils/WaiverComponent";
const useStyles = makeStyles((theme) => ({
  paper: {
    //display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    paddingInline: "50px",
    borderRadius: 15,
    marginTop: "30px",
    backgroundColor: "#f8f5f4",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: " #BF6D3A",
  },
  inputForm: {
    borderRadius: 5,
    borderColor: "gray",
    width: "100%",
  },
  label: {
    textAlign: "left",
    paddingBottom: "5px",
  },
}));

export default function EditForm(props) {
  let phone = localStorage.getItem("coach_phoneNumber");
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [datepicker, setDatePicker] = useState(false);
  const [regionProps, setRegionProps] = useState("");
  const [schoolProps, setSchoolProps] = useState("");
  const [regionsArray, setRegionsArray] = useState("");
  const [schoolsArray, setSchoolsArray] = useState("");
  // const [waiverInfo, setWaiverInfo] = useState({
  //   name: "",
  //   waiverResponse: "",
  //   date: "",
  //   time: "",
  //   contactId: "",
  //   contactEmail: "",
  //   waiverId: "",
  // });
  // const AcceptWaiver = (data) => {
  //   setWaiverInfo((prev) => ({
  //     ...prev,
  //     name: data.Name,
  //     waiverResponse: "Acceptance",
  //     date: "",
  //     time: "",
  //     contactId: "",
  //     contactEmail: "",
  //     waiverId: data.WaiverId,
  //   }));
  // };
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const ethnicityOptions = ethnicityArray.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const genderOptions = genderArray.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
  const [width, setWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  const options = schoolsArray;

  useEffect(() => {
    getRegionsData()
      .then(async (response) => {
        setRegionsArray(response);
        if (props.coachProps.Region) {
          setRegionProps(
            response.findIndex((r) => r.value === props.coachProps.Region)
          );
        } else setRegionProps(undefined);
      })
      .catch((e) => {
        console.log(e); // <== this **WILL** be invoked on exception
      });
    if (props.coachProps.Region) {
      getSchoolData(props.coachProps.Region)
        .then(async (response) => {
          setSchoolsArray(response);
          setSchoolProps(
            response.findIndex((s) => s.id === props.coachProps.SchoolSiteId)
          );
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        })
        .catch((e) => {
          console.log(e); // <== this **WILL** be invoked on exception
        });
    } else {
      setSchoolProps(undefined);
      setLoading(false);
    }
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  async function getSchoolSiteId(schoolName) {
    const results = schoolsArray.find(
      (school) => JSON.stringify(school.value) === JSON.stringify(schoolName)
    );
    return results.id;
  }
  const customStyles = {
    control: (base, { isDisabled }) => ({
      ...base,
      height: 28,
      minHeight: 28,
      borderWidth: 0,
      textAlign: "left",
      boxShadow: "none",
      backgroundColor: isDisabled ? "white" : "white",
    }),
    option: (provided, state) => ({
      ...provided,
      textAlign: "left",
    }),
  };
  //const [show, setShow] = useState(false);
  const confirmedError = () => {
    setLoading(false);
  };
  const confirmedRegistration = () => {
    window.top.location.href = "https://scoresu.org/coach";
  };
  const handleSubmit = async (data) => {
    const schoolSiteId = await getSchoolSiteId(data.schoolName.schoolname);
    const coach = {
      FirstName: data.firstName,
      MiddleName: data.middleName,
      LastName: data.lastName,
      Birthdate: dayjs(data.birthdate).format("YYYY-MM-DD"),
      PersonalEmail: data.coachEmail,
      Ethnicity: data.ethnicity,
      Gender: data.gender,
      Region: data.schoolName.region,
      AccountId: schoolSiteId,
    };
    //setLoading(true);
    const id = `${process.env.REACT_APP_CLIENT_ID}`;
    const secret = `${process.env.REACT_APP_CLIENT_SECRET}`;
    var myHeaders = new Headers();
    myHeaders.append("client_id", id);
    myHeaders.append("client_secret", secret);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(coach),
    };
    // dayjs.extend(advancedFormat);
    // dayjs.extend(utc);
    // dayjs.extend(timezone);
    // let timeZone = dayjs()
    //   .format("z")
    //   .toString()
    //   .replace(/\d+/g, "")
    //   .replace(/[^\w\s]/gi, "");
    // const waiverData = {
    //   waiverResponse: "Acceptance",
    //   datetime: dayjs().format("YYYY-MM-DDTHH:mm:ss") + timeZone,
    //   contactId: props.coachProps.Id,
    //   contactEmail: data.coachEmail,
    // };
    // var requestOptionsWaiver = {
    //   method: "POST",
    //   headers: myHeaders,
    //   redirect: "follow",
    //   body: JSON.stringify(waiverData),
    // };
    await fetch(
      `https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api/contacts/${props.coachProps.Id}`,
      requestOptions
    )
      .then(async (response) => {
        if (response.status === 200) {
          setLoading(false);
          const register_modal_success = {
            modal_title: "Successful modification",
            modal_text: `Your information has been successfully modified.<br /><b style="font-size:17px;" align="center">Remember to download our app to start taking attendance.<br /><br /><a target="_parent" href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180"
      height="70" /></a> <a target="_parent" href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
      height="70" /></a></b>`,

            modal_confirm_button: "DONE",
          };
          SuccessModal(
            register_modal_success,
            "success",
            confirmedRegistration
          );

          // await fetch(
          //   `https://salesforce-data-api-proxy-prod.us-e2.cloudhub.io/api/waiver/${waiverInfo.waiverId}`,
          //   requestOptionsWaiver
          // ).then((response) => {
          //   if (response.status === 200) {
          //     SuccessModal(
          //       register_modal_success,
          //       "success",
          //       confirmedRegistration
          //     );
          //   } else {
          //     setLoading(false);
          //     const error_modal = {
          //       modal_title: "Server error [500]",
          //       modal_text: `An error has occurred while saving the waiver acceptance. Please try again later. If this persists, please contact us.`,
          //       modal_confirm_button: "OK",
          //     };
          //     SuccessModal(error_modal, "error", confirmedError);
          //     setTimeout(() => {
          //       const register_modal_success = {
          //         modal_title: "Successful modification",
          //         modal_text: `Your information has been successfully modified.<br /><b style="font-size:17px;" align="center">Remember to download our app to start taking attendance.<br /><br /><a target="_parent" href="https://apps.apple.com/us/app/america-scores-attendance/id1527435979"><img src="https://iili.io/HOqRSRf.png" width="180"
          //   height="70" /></a> <a target="_parent" href="https://play.google.com/store/apps/details?id=com.americaScoresAttendance.app&hl=es_AR&gl=US"><img src="https://iili.io/HOq59WB.png" width="180"
          //   height="70" /></a></b>`,
          //         modal_confirm_button: "DONE",
          //       };
          //       SuccessModal(
          //         register_modal_success,
          //         "success",
          //         confirmedRegistration
          //       );
          //     }, 4500);
          //   }
          // });
        } else {
          setLoading(false);
          const error_modal = {
            modal_title: "Server error [500]",
            modal_text: `There is an issue with our server. If this persists, please contact us.`,
            modal_confirm_button: "OK",
          };
          SuccessModal(error_modal, "error", confirmedError);
        }
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

  return (
    <Grid
      container
      component="main"
      justifyContent="center"
      alignItems="center"
      spacing={{ xs: 0, sm: 0, md: 10, lg: 10 }}
    >
      {loading ? (
        <Loading open={loading} />
      ) : (
        <React.Fragment>
          <CssBaseline />
          <Grid
            align="center"
            justify="center"
            alignItems="center"
            item
            xs={12}
            sm={12}
            md={12}
          >
            <div
              className={classes.paper}
              style={{
                width: width < 720 ? "100%" : width < 1380 ? "50%" : "30%",
              }}
            >
              <Formik
                initialValues={{
                  firstName:
                    props.coachProps !== null ? props.coachProps.FirstName : "",
                  middleName:
                    props.coachProps !== null
                      ? props.coachProps.MiddleName
                      : "",
                  lastName:
                    props.coachProps !== null ? props.coachProps.LastName : "",
                  schoolName: {
                    region:
                      props.coachProps !== null
                        ? regionProps
                          ? regionsArray[Number(regionProps)].value
                          : ""
                        : "",
                    schoolname:
                      props.coachProps !== null
                        ? schoolProps
                          ? schoolsArray[Number(schoolProps)].value
                          : ""
                        : "",
                  },
                  coachEmail:
                    props.coachProps !== null
                      ? props.coachProps.PersonalEmail
                      : "",
                  coachphoneNumber:
                    props.coachProps !== null ? phone.slice(2) : "",
                  birthdate:
                    props.coachProps !== null
                      ? dayjs(props.coachProps.Birthdate)
                      : dayjs(),
                  gender:
                    props.coachProps !== null ? props.coachProps.Gender : "",
                  ethnicity:
                    props.coachProps !== null ? props.coachProps.Ethnicity : "",
                  //waiver: false,
                }}
                validationSchema={Yup.object().shape({
                  firstName: Yup.string().required("Field is required (*)"),
                  lastName: Yup.string().required("Field is required (*)"),
                  schoolName: Yup.object({
                    region: Yup.string().required("Field is required (*)"),
                    schoolname: Yup.string().required("Field is required (*)"),
                  }),
                  coachEmail: Yup.string()
                    .required("Field is required (*)")
                    .email("Email is not valid"),
                  coachphoneNumber: Yup.string()
                    .required("Field is required (*)")
                    .matches(phoneRegExp, "Phone number is not valid")
                    .min(10, "Phone number is not valid")
                    .max(10, "Phone number is not valid"),
                  birthdate: Yup.date().max(date, "Field is required (*)"),
                  gender: Yup.string().required("Field is required (*)"),
                  ethnicity: Yup.string().required("Field is required (*)"),
                  // waiver: Yup.bool().oneOf(
                  //   [true],
                  //   "You need to review and accept waiver (*)"
                  // ),
                })}
                onSubmit={(data) => {
                  setLoading(true);
                  handleSubmit(data);
                }}
              >
                {({ values, touched, handleSubmit, setFieldValue, errors }) => (
                  <form autoComplete="off" onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className={classes.inputForm}>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="firstName">First Name*</label>
                          </div>
                          <Field
                            name="firstName"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter first name"
                            className={
                              "form-control" +
                              (errors.firstName && touched.firstName
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="middleName">Middle Name</label>
                          </div>
                          <Field
                            name="middleName"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter middle name"
                            className={
                              "form-control" +
                              (errors.middleName && touched.middleName
                                ? " is-invalid"
                                : "")
                            }
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="lastName">Last Name*</label>
                          </div>
                          <Field
                            name="lastName"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter last name"
                            className={
                              "form-control" +
                              (errors.lastName && touched.lastName
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="schoolName">
                              SCORES Program Site
                            </label>
                          </div>
                          <div
                            className="form-group"
                            style={{
                              marginBottom: "20px",
                              backgroundColor: "#b3d7fc",
                              padding: "15px",
                              borderRadius: 10,
                            }}
                          >
                            <div className={classes.label}>
                              <label htmlFor="schoolName.region">
                                SCORES Region*
                              </label>
                            </div>
                            <Select
                              styles={customStyles}
                              searchable={false}
                              blurInputOnSelect={true}
                              menuPlacement="auto"
                              defaultValue={
                                regionProps
                                  ? regionsArray[Number(regionProps)]
                                  : ""
                              }
                              name="schoolName.region"
                              placeholder="Select Region"
                              options={regionsArray}
                              className={
                                "form-control" +
                                (errors.schoolName?.region &&
                                touched.schoolName?.region
                                  ? " is-invalid"
                                  : "")
                              }
                              onChange={async ({ value }) => {
                                setSchoolProps(undefined);
                                const school = await getSchoolData(value);
                                setSchoolsArray(school);
                                setFieldValue("schoolName.region", value);
                                setFieldValue("schoolName.schoolname", "");
                              }}
                            />
                            <ErrorMessage
                              name="schoolName.region"
                              component="div"
                              className="invalid-feedback"
                            />
                            <div
                              className={classes.label}
                              style={{ marginTop: "20px" }}
                            >
                              <label htmlFor="schoolName.schoolname">
                                SCORES Site Name*
                              </label>
                              <Select
                                isDisabled={
                                  values.schoolName.region.length === 0
                                    ? true
                                    : false
                                }
                                searchable={false}
                                blurInputOnSelect={true}
                                value={
                                  schoolProps
                                    ? schoolsArray[Number(schoolProps)]
                                    : schoolsArray.filter(
                                        (s) =>
                                          s.value ===
                                          values.schoolName.schoolname
                                      )
                                }
                                styles={customStyles}
                                menuPlacement="auto"
                                placeholder="School Name"
                                name="schoolName.schoolname"
                                options={options}
                                className={
                                  "form-control" +
                                  (errors.schoolName?.schoolname &&
                                  touched.schoolName?.schoolname
                                    ? " is-invalid"
                                    : "")
                                }
                                onChange={({ value }) => {
                                  setFieldValue("schoolName.schoolname", value);
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="schoolName.schoolname"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="coachEmail">Email*</label>
                          </div>
                          <Field
                            name="coachEmail"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Email"
                            className={
                              "form-control" +
                              (errors.coachEmail && touched.coachEmail
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="coachEmail"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="coachphoneNumber">
                              Phone Number* (This will be the number you will
                              use to access your Accounts)
                            </label>
                          </div>
                          <Field
                            name="coachphoneNumber"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Phone Number"
                            className={
                              "form-control" +
                              (errors.coachphoneNumber &&
                              touched.coachphoneNumber
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="coachphoneNumber"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label
                              htmlFor="birthdate"
                              style={{ marginBottom: "10px" }}
                            >
                              Birthdate*
                            </label>
                          </div>
                          <MobileDatePicker
                            inputVariant="outlined"
                            disableFuture={true}
                            open={datepicker}
                            onClose={() => setDatePicker(false)}
                            onOpen={() => setDatePicker(true)}
                            InputProps={{
                              disableUnderline: true,
                            }}
                            label="Select Date"
                            name="birthdate"
                            value={values.birthdate}
                            onChange={(newValue) => {
                              setFieldValue("birthdate", newValue.$d);
                            }}
                            renderInput={(params) => (
                              <TextField
                                style={{ cursor: "pointer" }}
                                size="small"
                                variant="outlined"
                                {...params}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      onClick={() => setDatePicker(!datepicker)}
                                    >
                                      <CalendarMonthIcon />
                                    </InputAdornment>
                                  ),
                                  disableUnderline: true,
                                }}
                              />
                            )}
                            className={
                              "form-control" +
                              (errors.birthdate && touched.birthdate
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="birthdate"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="gender">Gender*</label>
                          </div>
                          <Select
                            searchable={false}
                            blurInputOnSelect={true}
                            styles={customStyles}
                            defaultValue={
                              props.coachProps !== null
                                ? genderOptions.filter(
                                    (option) =>
                                      option.value === props.coachProps.Gender
                                  )
                                : ""
                            }
                            menuPlacement="auto"
                            placeholder="Select..."
                            name="gender"
                            options={genderOptions}
                            className={
                              "form-control" +
                              (errors.gender && touched.gender
                                ? " is-invalid"
                                : "")
                            }
                            onChange={(selectedOption) =>
                              setFieldValue("gender", selectedOption.value)
                            }
                          />
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div
                          className="form-group"
                          style={{ marginBottom: "20px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="ethnicity">Ethnicity*</label>
                          </div>
                          <Select
                            searchable={false}
                            blurInputOnSelect={true}
                            styles={customStyles}
                            menuPlacement="auto"
                            defaultValue={
                              props.coachProps !== null
                                ? ethnicityOptions.filter(
                                    (option) =>
                                      option.value ===
                                      props.coachProps.Ethnicity
                                  )
                                : ""
                            }
                            placeholder="Select..."
                            name="ethnicity"
                            options={ethnicityOptions}
                            className={
                              "form-control" +
                              (errors.ethnicity && touched.ethnicity
                                ? " is-invalid"
                                : "")
                            }
                            onChange={(selectedOption) =>
                              setFieldValue("ethnicity", selectedOption.value)
                            }
                          />
                          <ErrorMessage
                            name="ethnicity"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        {/* <div
                          className="form-group"
                          style={{ marginBottom: "40px" }}
                        >
                          <div className={classes.label}>
                            <label htmlFor="waiver">Waiver</label>
                          </div>
                          <label
                            style={{
                              textAlign: "left",
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <Field
                              type="checkbox"
                              name="waiver"
                              id="cb1"
                              disabled={values.waiver === false ? true : false}
                            />
                            <Button
                              size={"small"}
                              onClick={() => setShow(true)}
                            >
                              Show waiver
                            </Button>
                          </label>
                          {errors.waiver && touched.waiver ? (
                            <div
                              style={{
                                textAlign: "center",
                                color: "#dc3545",
                                fontSize: ".875em",
                                marginTop: ".25rem",
                              }}
                            >
                              {errors.waiver}
                            </div>
                          ) : null}
                        </div> */}
                        {/* {show === true ? (
                          <WaiverComponent
                            confirmButton="Accept"
                            deniedButton="Dismiss"
                            function={() => setShow(false)}
                            checkboxFunction={setFieldValue}
                            addWaiverData={AcceptWaiver}
                          />
                        ) : null} */}
                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "8%",
                            textAlign: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Button
                              size={"medium"}
                              variant="contained"
                              disabled={loading}
                              onClick={() => {
                                handleSubmit();
                              }}
                            >
                              Submit
                            </Button>
                            {loading && (
                              <CircularProgress
                                size={24}
                                sx={{
                                  color: blue[500],
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            )}
                          </Box>
                        </div>
                      </div>
                    </LocalizationProvider>
                  </form>
                )}
              </Formik>
            </div>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}
