import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import firebase from "firebase/compat/app"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhLgDx9sVWQMWp7cryH8SNxa3PgxhY6K8",
  authDomain: "extractpdfpages.firebaseapp.com",
  projectId: "extractpdfpages",
  storageBucket: "extractpdfpages.appspot.com",
  messagingSenderId: "778970861634",
  appId: "1:778970861634:web:af71f39d3456b741901ddb",
  measurementId: "G-DEXWS10X42"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
