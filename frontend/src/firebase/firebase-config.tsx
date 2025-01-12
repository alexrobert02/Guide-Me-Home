import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestPermissionForNotifications = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
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
