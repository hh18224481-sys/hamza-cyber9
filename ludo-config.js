// Paste your Firebase web-app configuration here from Firebase Console.
// Never put service-account private keys in this file.
export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};
export const isFirebaseConfigured = () =>
  firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_") &&
  firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("YOUR_") &&
  firebaseConfig.appId && !firebaseConfig.appId.startsWith("PASTE_");
