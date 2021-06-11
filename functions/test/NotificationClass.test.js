const NotificationClass = require("../src/NotificationClass.js");
const firebaseAdminSdk = require("firebase-admin");
const credential = require("../credential.json");
firebaseAdminSdk.initializeApp({
  credential: firebaseAdminSdk.credential.cert(credential),
});
const db = firebaseAdminSdk.firestore().settings({
  host: "localhost:8080",
  ssl: false,
});
const notificationInstance = new NotificationClass();
// test("send notification test ", async () => {
//   const result = await notificationInstance.sendNotification(
//     "Hey! vous avez reçu une livraison.",
//     "Mr Ndiaye viens de vous envoyer une livraison.",
//     "co6pTAT8Ql2MVO4EOJIpV4:APA91bFEibU_gLOjot7HULpo3TeTBLaNSiDJJI8Yf5hiCK7hVGD7U7D7EWlNAR4h0ZseQr3U5ORTO1j4yaVAvf89DJZvhNTuj1ktQj5hthV7WIS2Oa8XE-fNxv00bMojbV8TIGJS1p6r"
//   );
//   expect(result).toBeTruthy();
// });

test("send notification test ", async () => {
  const result = await notificationInstance.addNotification(
    "mt4TYr22teGKtEvDbq9L",
    "Only for sender.",
    "sender",
    err => console.log(err)
  );
  expect(result).toBeTruthy();
});

// test("checkIfRegionIsValid ",  () => {
//   expect(checkInfoInstance.checkIfRegionIsValid("dakar")).toBeTruthy();
// });
