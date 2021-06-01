const DeliveryManagerClass = require("../src/DeliveryManagerClass");
const firebaseAdminSdk = require("firebase-admin");
const credential = require("../credential.json");

firebaseAdminSdk.initializeApp({
  credential: firebaseAdminSdk.credential.cert(credential),
});
const db = firebaseAdminSdk.firestore().settings({
  host: "localhost:8080",
  ssl: false,
});

// test("Test delivery creation", async () => {
//   const deliveryInstance = new DeliveryManagerClass();
//   // By tweaking the values you
//   // can test methods.
//   const __params__needed = {
//     senderUid: "QIlwuKdkEwSLZB6RXz9KTGWHhn03",
//     senderName: "Ibro",
//     receiverName: "superman",
//     senderNotificationToken:
//       "ecmRdQ9ZRIq3BRI_QnbmGr:APA91bEcUD3zu34i4" +
//       "F-lG8Vv5Dv8J_gP_A0w4AAmZX7Xm-Mhps0Fhr8bFy" +
//       "LUXFQesGZ6fj9Zl1w_6a-Qh_VMXa9cZrnUNMwa3EPl" +
//       "duQBrL5yMcYTVQBerQFBG_YNNmxxFv_3jwdlxTg7",
//     senderLongitude: "-17.3999983",
//     senderLatitude: "14.7799983",
//     senderCity: "Guediawaye",
//     senderRegion: "Dakar",
//     senderAddress: "Corniche Arret Dial Mbaye, Niarry Boulangerie",
//   };
//   const returned = await deliveryInstance.createDelivery(__params__needed);
//   expect(returned).toBeTruthy();
// });

// test("Check if the delivery is not duplicated", async () => {
//   const deliveryInstance = new DeliveryManagerClass();
//   const __params__needed = {
//     senderPhone: "+221773059798",
//     receiverPhone: "+221774662232",
//   };
//   const returned = await deliveryInstance.onGoingDeliveryIsDuplicated(
//     __params__needed.senderPhone,
//     __params__needed.receiverPhone
//   );
//   expect(returned).toBeTruthy();
// });

// test("check if the phone is part of the delivery", async () => {
//   const __params__needed = {
//     phone: "+221774662232",
//     deliveryId: "3FGG8q7QnWtUmKX0Ip0U",
//   };
//   const deliveryInstance = new DeliveryManagerClass();
//   const returned = await deliveryInstance.checkIfPhoneBelongToTheDelivery(
//     __params__needed.phone,
//     __params__needed.deliveryId
//   );
//   expect(returned).toBeTruthy();
// });

test("check if the price is already set", async () => {
  const __params__needed = {
    phone: "+221774662232",
    deliveryId: "3FGG8q7QnWtUmKX0Ip0U",
    price: "2000",
  };

  const deliveryInstance = new DeliveryManagerClass();
  const returned = await deliveryInstance.priceAlreadySet(__params__needed);
  expect(returned).toBeTruthy();
});
