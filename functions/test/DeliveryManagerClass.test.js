const DeliveryManagerClass = require("../src/DeliveryManagerClass");
const deliveryInstance = new DeliveryManagerClass();

// test("Test delivery creation", async () => {
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



test("Check if the delivery is not duplicated", async () => {
  const __params__needed = {
    senderPhone: "+221773059798",
    receiverPhone: "+221774662232",
  };
  const returned = await deliveryInstance.onGoingDeliveryIsDuplicated(
    __params__needed.senderPhone,
    __params__needed.receiverPhone
  );
  expect(returned).toBeTruthy();
});
