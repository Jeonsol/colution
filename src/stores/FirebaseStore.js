import firebase from 'firebase';

// Initialize Firebase
var firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCO2cC-XueZmhkEaiFdRnO_2Xu1ZN-OG0A",
    authDomain: "colution-d3d9c.firebaseapp.com",
    databaseURL: "https://colution-d3d9c.firebaseio.com",
    projectId: "colution-d3d9c",
    storageBucket: "colution-d3d9c.appspot.com",
    messagingSenderId: "291887907774"
});

const Database = {
    root: firebaseApp.database(),
    wrap: firebaseApp.database().ref('wrap'),
    contents: firebaseApp.database().ref('wrap/contents'),
    user: firebaseApp.database().ref('user'),
    comments: firebaseApp.database().ref('wrap/comments'),
    recomments: firebaseApp.database().ref('wrap/recomments'),
};

export { Database };