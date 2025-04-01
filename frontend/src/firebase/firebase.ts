import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const registerSWAndRequestNotificationPermission = async () => {
  try {
    await registerServiceWorker();

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_APP_FCM_VAPID_KEY,
    });

    if (!token) {
      console.warn('No FCM token received. Check VAPID key.');
      return null;
    }

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error requesting notification permission', error);
    return null;
  }
};

// Listen for foreground notifications
export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Foreground notification received:', payload);
    // new Notification(payload.notification?.title || "AuctiX Notification", {
    //   body: payload.notification?.body || "",
    //   icon: payload.notification?.image || "",
    // });
  });
};

let serviceWorkerRegistered = false;

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      if (serviceWorkerRegistered) {
        console.log('Service Worker already registered.');
        return;
      }

      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      );
      console.log('Service Worker registered with scope:', registration.scope);
      serviceWorkerRegistered = true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  } else {
    console.warn('Service Worker is not supported in this browser.');
  }
};

export { messaging };
