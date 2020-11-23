import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
// Required for side-effects

// Backup
const firebaseConfig = {
  apiKey: "AIzaSyBy2iVQ44v9Upg2QljlUq5_Z-jM51l9kQM",
  authDomain: "langitedubackup.firebaseapp.com",
  databaseURL: "https://langitedubackup.firebaseio.com",
  projectId: "langitedubackup",
  storageBucket: "langitedubackup.appspot.com",
  messagingSenderId: "1042775536571",
  appId: "1:1042775536571:web:0de98e9201de06c2010a9e",
};

// Main
// const firebaseConfig = {
//   apiKey: "AIzaSyADdV20RUzhl30KtRkQnJUVin-0scEZaRw",
//   authDomain: "langit-edu.firebaseapp.com",
//   databaseURL: "https://langit-edu.firebaseio.com",
//   projectId: "langit-edu",
//   storageBucket: "langit-edu.appspot.com",
//   messagingSenderId: "1043332770295",
//   appId: "1:1043332770295:web:5a59e4bced1989aa3766f2",
//   measurementId: "G-ZN7E8FGQYE"
// };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();
// Auth
firebase.auth().useDeviceLanguage();
const auth = app.auth();
const EmailAuthProvider = firebase.auth.EmailAuthProvider
// Firestore
const db = firebase.firestore();
const FieldValue = firebase.firestore.FieldValue;
// Storage
const storage = app.storage();
// Functions
const functions = firebase.functions();
let API_URL;
if (window.location.hostname === "localhost") {
  // db.useEmulator("localhost", 8080);
  // functions.useEmulator('localhost', 5001)
  // auth.useEmulator('http://localhost:9099/')
  API_URL = `http://localhost:5001/langitedubackup/asia-southeast2/api`
}else{
  API_URL='https://asia-southeast2-langitedubackup.cloudfunctions.net/api'
}

export {auth, EmailAuthProvider,db, FieldValue, storage, functions, API_URL }
export default app;