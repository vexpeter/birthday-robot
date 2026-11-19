importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB66TW4s5t4wad27trMjxJ6ydrteV0HyaY",
  authDomain: "rememberme002.firebaseapp.com",
  projectId: "rememberme002",
  storageBucket: "rememberme002.firebasestorage.app",
  messagingSenderId: "180226745748",
  appId: "1:180226745748:web:69027dbdbfd98dd2121b81"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "Remember Me!";
  const options = {
    body: payload.notification?.body || payload.data?.body || "Szülinapi emlékeztető!",
    icon: "icon.png"
  };

  self.registration.showNotification(title, options);
});
