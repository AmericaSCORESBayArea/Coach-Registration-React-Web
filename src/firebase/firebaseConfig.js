import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/storage";
import "firebase/compat/analytics";

var firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${process.env.FIREBASE_DATABASE_URL}`,
  projectId: `${process.env.FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.FIREBASE_MESSAGE_SENDER_ID}`,
  appId: `${process.env.FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    localStorage.setItem("coach_phoneNumber", user._delegate.phoneNumber);
    localStorage.setItem("coach_user", true);
  } else {
    localStorage.setItem("coach_user", false);
    localStorage.setItem("coach_phoneNumber", "");
  }
});

export const db = firebase.firestore();
firebase.analytics();

export { firebase as default };
