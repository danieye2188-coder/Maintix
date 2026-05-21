importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
);

firebase.initializeApp({

  apiKey: "AIzaSyANLs4XPMJb3tZ2TejuWg_kTCGK9zL_LtM",

  authDomain: "game-2168b.firebaseapp.com",

  projectId: "game-2168b",

  storageBucket: "game-2168b.firebasestorage.app",

  messagingSenderId: "871647963096",

  appId: "1:871647963096:web:9279fb718663e8e63834ad"

});

const messaging = firebase.messaging();
