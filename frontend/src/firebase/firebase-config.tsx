import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBKTV4Cu6nLHCi2sNaSfuhTcmrYgSxRODk",
    authDomain: "guide-me-home.firebaseapp.com",
    projectId: "guide-me-home",
    storageBucket: "guide-me-home.firebasestorage.app",
    messagingSenderId: "125620622392",
    appId: "1:125620622392:web:760d551586a4b7676982cd",
    measurementId: "G-BC84SSHE41"
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestPermissionForNotifications = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: "BLBOYQ1kLPdJROLjCom4ib1UNA6pAETQ9vn2v1LWtAVNxYGONMP-3MFbj1iqWwEs4T7z6lCZorWn6pekGM7RoZI",
      });
      if (token) {
        console.log("Push notification token:", token);
        return token;  // Returnează token-ul
      } else {
        console.log("No registration token available.");
        return null;
      }
    } catch (error) {
      console.error("Error getting token for notifications:", error);
      return null;
    }
  };
  

export const setupOnMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    alert(payload.notification?.title || "New notification!");
  });
};

export default firebaseApp;
