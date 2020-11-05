import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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
export const db = firebase.firestore();
export const auth = app.auth();
export const storage = app.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export default app;