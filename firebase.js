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
  set,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWHYn160O4oSFEPbrc7WRCIKjU7fO0008",
  authDomain: "iotwebbased-32566.firebaseapp.com",
  databaseURL: "https://iotwebbased-32566-default-rtdb.firebaseio.com",
  projectId: "iotwebbased-32566",
  storageBucket: "iotwebbased-32566.appspot.com",
  messagingSenderId: "836120121218",
  appId: "1:836120121218:web:c2af111255095812d4499b",
  measurementId: "G-XRLV876YJ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const dbRef = ref(getDatabase());

const tempData = document.getElementById("temp-data");
const humidData = document.getElementById("humid-data");
const rainData = document.getElementById("rain-data");

const starCountRef = ref(db, "/sensor");
// var getdata = onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   return data;
// });

// onValue(starCountRef, (snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//     return snapshot.val();
//   } else {
//     console.log("No data available");
//   }
// });

// var getdata = get(child(dbRef, `/sensor`))
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       console.log(snapshot.val());
//       return snapshot.val();
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
var temp_lock = false;
var humid_lock = false;
var rain_lock = false;
var data;
var getdata = onValue(starCountRef, (snapshot) => {
   data = snapshot.val();
   console.log(data);
  if (temp_lock) {
  tempData.innerHTML = Object.values(data)[2] + "°C";
  }
  if (humid_lock) {
  humidData.innerHTML = Object.values(data)[0] + "%";
  }
  if (rain_lock) {
  rainData.innerHTML = Object.values(data)[1] + "%";
  }
});

document.getElementById("read-temp-btn").onclick = async () => {
  temp_lock = true;
  tempData.innerHTML = Object.values(data)[2] + "°C";
};

document.getElementById("read-humid-btn").onclick = async () => {
  humid_lock = true;
  humidData.innerHTML = Object.values(data)[0] + "%";
};

document.getElementById("read-rain-btn").onclick = async () => {
  rain_lock = true;
  rainData.innerHTML = Object.values(data)[1] + "%";
};

console.log({ tempData, humidData });
// function getTempData(data) {
//   return tempData.innerHTML = Object.values(data)[1];
// }

function writeStatus(servo, light, buzzer) {
  const db = getDatabase();
  set(ref(db, "status/"), {
    servo: servo,
    light: light,
    buzzer: buzzer,
  });
}
function writeNewServoStatus(servo) {
  const db = getDatabase();
  update(ref(db, "status/"), {
    servo: servo,
  });
}
function writeNewLightStatus(light) {
  const db = getDatabase();
  update(ref(db, "status/"), {
    light: light,
  });
}
function writeNewBuzzerStatus(buzzer) {
  const db = getDatabase();
  update(ref(db, "status/"), {
    buzzer: buzzer,
  });
}

function writeNewTestStatus(test) {
  const db = getDatabase();
  update(ref(db, "status/"), {
    test: test,
  });
}

function readStatus() {
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  get(child(dbRef, "status/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

var servoOffImg = document.getElementById("servo-off-img");
var servoOnImg = document.getElementById("servo-on-img");
var lightOnImg = document.getElementById("light-on-img");
var lightOffImg = document.getElementById("light-off-img");
var buzzerOffImg = document.getElementById("buzzer-off-img");
var buzzerOnImg = document.getElementById("buzzer-on-img");
document.getElementById("servo-on-btn").onclick = () => {
  writeNewServoStatus(true);
  servoOnImg.classList.remove("hidden");
  servoOffImg.classList.add("hidden");
};
document.getElementById("servo-off-btn").onclick = () => {
  writeNewServoStatus(false);
  servoOnImg.classList.add("hidden");
  servoOffImg.classList.remove("hidden");
};

document.getElementById("light-on-btn").onclick = () => {
  writeNewLightStatus(true);
  lightOnImg.classList.remove("hidden");
  lightOffImg.classList.add("hidden");
};
document.getElementById("light-off-btn").onclick = () => {
  writeNewLightStatus(false);
  lightOnImg.classList.add("hidden");
  lightOffImg.classList.remove("hidden");
};
document.getElementById("buzzer-on-btn").onclick = () => {
  writeNewBuzzerStatus(true);
  buzzerOnImg.classList.remove("hidden");
  buzzerOffImg.classList.add("hidden");
};
document.getElementById("buzzer-off-btn").onclick = () => {
  writeNewBuzzerStatus(false);
  buzzerOnImg.classList.add("hidden");
  buzzerOffImg.classList.remove("hidden");
};

// document.getElementById("test-off-btn").onclick = () => {
//   writeNewTestStatus(false);
// };

// document.getElementById("test-on-btn").onclick = () => {
//   writeNewTestStatus(true);
// }

// document.getElementById("light-toggle-btn").onclick = () => {
//   if(document.getElementById("light-toggle-btn").innerHTML == "Turn On"){
//     writeNewLightStatus(true);
//     lightOnImg.classList.remove("hidden");
//     lightOffImg.classList.add("hidden");
//     document.getElementById("light-toggle-btn").innerHTML = "Turn Off";
// }
//   else{
//     writeNewLightStatus(false);
//     lightOnImg.classList.add("hidden");
//     lightOffImg.classList.remove("hidden");
//     document.getElementById("light-toggle-btn").innerHTML = "Turn On";
//   }
// }

export {
  writeStatus,
  writeNewServoStatus,
  writeNewLightStatus,
  writeNewBuzzerStatus,
  readStatus,
};
