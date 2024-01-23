import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDfIAs6X_4bfJltwl0mp6AiDvfgMOunl1w",
    authDomain: "clone-drive-x.firebaseapp.com",
    projectId: "clone-drive-x",
    storageBucket: "clone-drive-x.appspot.com",
    messagingSenderId: "795614575670",
    appId: "1:795614575670:web:19e615636d48747b532c97"
  };
  
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();

  const auth = firebase.auth();

  const storage = firebase.storage();

  const provider = new firebase.auth.GoogleAuthProvider();



  export {auth, provider, db, storage};