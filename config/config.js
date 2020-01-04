import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCLYxEzqgueZTNUSqh_-CBvAieTjtrR25w",
    authDomain: "findempo.firebaseapp.com",
    databaseURL: "https://findempo.firebaseio.com",
    projectId: "findempo",
    storageBucket: "findempo.appspot.com",
    messagingSenderId: "173163998575",
    appId: "1:173163998575:web:66f4981a9eb40b08a3cc9a"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  export const f = firebase;
  export const database =  firebase.database();
  export const auth = firebase.auth();
  export const storage = firebase.storage();
