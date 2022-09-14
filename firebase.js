// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-analytics.js";
import {
  getDatabase,
  ref,
  get,
  child,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi70wIBVNj5_SKiBFtn0ua4RbK6XajVOQ",
  authDomain: "dht11-41e5b.firebaseapp.com",
  databaseURL: "https://dht11-41e5b-default-rtdb.firebaseio.com",
  projectId: "dht11-41e5b",
  storageBucket: "dht11-41e5b.appspot.com",
  messagingSenderId: "1042127375321",
  appId: "1:1042127375321:web:5a38d454fbbaf9d02a67c8",
  measurementId: "G-MBN978P1BF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const dbRef = ref(getDatabase());

const tempData = document.getElementById("temp-data");
const humidData = document.getElementById("humid-data");

var getdata = get(child(dbRef, `/`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

document.getElementById("read-temp-btn").onclick = async () => {
  const a = await getdata;
  tempData.innerHTML = Object.values(a)[1] + "°C";
};

document.getElementById("read-humid-btn").onclick = async () => {
  const a = await getdata;
  humidData.innerHTML = Object.values(a)[0] + "%";
};
console.log({ tempData, humidData });
// function getTempData(data) {
//   return tempData.innerHTML = Object.values(data)[1];
// }
