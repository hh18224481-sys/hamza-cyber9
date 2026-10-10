HAMZA.com V12 — LUDO ONLINE SETUP
================================

The Ludo interface is included, but online rooms will NOT work until Firebase is configured. This package does not include or invent Firebase credentials.

A) Create the Firebase project
1. Open https://console.firebase.google.com/ and create a project.
2. In Project settings > General, create/register a Web app and copy its Firebase web config.
3. Open Authentication > Sign-in method and enable Anonymous sign-in.
4. Open Realtime Database and create a database. Copy its databaseURL exactly.
5. In Realtime Database > Rules, paste the contents of firebase-database.rules.json and publish the rules.
6. Open ludo-config.js and replace all placeholders with the values from your Firebase web app. Keep the strings quoted. Do not paste a service-account private key here.
7. Upload all files to HTTPS hosting. ES modules and Firebase Auth require a web server/HTTPS; opening index.html directly as file:// will not work.
8. Test with two different devices/browsers: create a room on device A, copy the six-character code, join on device B, and confirm turns synchronize.

B) Database rules warning
The included rules are a basic room-access starting point for a prototype, not competitive-grade anti-cheat. Authenticated users can read a room when they know its code, and either participant can write room state. Do not use this prototype for money, prizes, personal/sensitive information, or hostile public matchmaking. For production, move turn validation to trusted Cloud Functions or another server, validate every state transition, add rate limits and room expiration, and restrict reads/writes more tightly.

C) How it plays
- Two players per private room; creator is red, second player is blue.
- Share the six-character room code with the other player.
- Each player has four pieces. A six is needed to leave base; rolling six gives another turn; landing on an opponent on a non-safe square sends it home.
- The online UI and room synchronization need a configured Firebase project before they can be tested live.

D) Files
- ludo.js: online room and game logic using Firebase Web SDK module imports.
- ludo-config.js: your public Firebase web-app configuration placeholders.
- firebase-database.rules.json: starter Realtime Database rules.
- All original V11 photos, music, video, social links and other site files are retained.
