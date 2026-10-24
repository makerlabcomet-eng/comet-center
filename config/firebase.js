/* =====================================================================
   COMET CENTER · FIREBASE CONNECTION
   ---------------------------------------------------------------------
   Connects the website to the lab's Firebase project (free Spark plan).
   These values come from Firebase console → Project settings → Your apps.

   They are not secret: every Firebase website ships them to the browser.
   What protects the data is firestore.rules, which decides who can read
   and change what.

   Don't edit this unless the lab moves to a different Firebase project.
===================================================================== */

window.COMET_FIREBASE = {
  apiKey: "AIzaSyCvXKVFxMlDnzyOisEwFevvOfi2xDiqIqQ",
  authDomain: "comet-center-iith.firebaseapp.com",
  projectId: "comet-center-iith",
  storageBucket: "comet-center-iith.firebasestorage.app",
  messagingSenderId: "782358924785",
  appId: "1:782358924785:web:02f83b4821c7c356b04850",
};
