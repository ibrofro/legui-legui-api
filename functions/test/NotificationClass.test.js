const NotificationClass = require("../src/NotificationClass.js");
const notificationInstance = new NotificationClass();

test("send notification test ", async () => {
  const result = await notificationInstance.sendNotification(
    "Hey! vous avez reçu une livraison.",
    "Mr Ndiaye viens de vous envoyer une livraison.",
    "co6pTAT8Ql2MVO4EOJIpV4:APA91bFEibU_gLOjot7HULpo3TeTBLaNSiDJJI8Yf5hiCK7hVGD7U7D7EWlNAR4h0ZseQr3U5ORTO1j4yaVAvf89DJZvhNTuj1ktQj5hthV7WIS2Oa8XE-fNxv00bMojbV8TIGJS1p6r"
  );
  expect(result).toBeTruthy();
});

// test("checkIfRegionIsValid ",  () => {
//   expect(checkInfoInstance.checkIfRegionIsValid("dakar")).toBeTruthy();
// });
