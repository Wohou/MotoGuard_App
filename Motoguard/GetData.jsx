import firebase from 'firebase/compat/app';
import {getDatabase} from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSHrYTUkc_U4fl_X1xOMweeH-BSwZjjx4",
    authDomain: "motoguard-400508.firebaseapp.com",
    databaseURL: "https://motoguard-400508-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "motoguard-400508",
    storageBucket: "motoguard-400508.appspot.com",
    messagingSenderId: "388962084076",
    appId: "1:388962084076:web:cf502b377feebca459f1c9",
    measurementId: "G-JHPGJQX0DX"
  }

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

export { db }
