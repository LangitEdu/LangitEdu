import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
// Required for side-effects

const firebaseConfig = {
  apiKey: "AIzaSyADdV20RUzhl30KtRkQnJUVin-0scEZaRw",
  authDomain: "langit-edu.firebaseapp.com",
  databaseURL: "https://langit-edu.firebaseio.com",
  projectId: "langit-edu",
  storageBucket: "langit-edu.appspot.com",
  messagingSenderId: "1043332770295",
  appId: "1:1043332770295:web:ac8096202d179f753766f2",
  measurementId: "G-8RFQS90YJ3"
};



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
  API_URL = `http://localhost:5001/langit-edu/asia-southeast2/api`
}else{
  API_URL='https://us-central1-langit-edu.cloudfunctions.net/api'
}

export {auth, EmailAuthProvider,db, FieldValue, storage, functions, API_URL }
export default app;