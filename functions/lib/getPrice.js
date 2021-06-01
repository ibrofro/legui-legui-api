const app = require("express");

const route = app.Router();

const functions = require("firebase-functions");

const DeliveryManagerClass = require("./DeliveryManagerClass");

const ApiCommunicationClass = require("./ApiCommunicationClass");

const UserClass = require("./UserClass");

const status = require("./status");

route.post("/", async (req, res) => {
  try {
    const dt = req.body; // Check if the user exists.

    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(dt.receiverPhone, dt.receiverUid); // Check if the delivery is not duplicated

    const deliveryManager = new DeliveryManagerClass();
    const phoneBelongToDelivery = await deliveryManager.checkIfPhoneBelongToTheDelivery(dt.receiverPhone, dt.deliveryId); // Check if the price is already set.

    const priceIsSet = await deliveryManager.priceAlreadySet(phoneBelongToDelivery); // Retrieve the location

    const apiCom = new ApiCommunicationClass(); // const location = await apiCom.geoLocateUser(
    //   dt.senderLongitude,
    //   dt.senderLatitude
    // );
    // Create the delivery
    // const deliveryParam = { ...dt, ...location };
    // const created = await deliveryManager.createDelivery(deliveryParam);
    // Send notification to the receiver.
    // const receiverInfo = await userIns.getUserByPhone(dt.receiverPhone);
    // const notification = new NotificationClass();
    // const title = `${senderInfo.name} vient de vous envoyer une livraison..`;
    // const bodyContent = "Veuillez confirmer pour recevoir la livraison.";
    // await notification.sendNotification(
    //   title,
    //   bodyContent,
    //   receiverInfo.notificationToken
    // );
    // Send a response.

    res.send(phoneBelongToDelivery);
  } catch (error) {
    if (error.userMustBeNotified) {
      console.log(`${error.stack}`);
      res.status(500);
      res.json({
        deliveryStatus: error.userMustBeNotified
      });
    } else {
      console.log(`${error.stack}`);
      res.status(500);
      res.send("An error occurred");
    }
  }
});
module.exports = route;