const app = require("express");

const route = app.Router();

const functions = require("firebase-functions");

const DeliveryManagerClass = require("./DeliveryManagerClass");

const ApiCommunicationClass = require("./ApiCommunicationClass");

const UserClass = require("./UserClass");

const status = require("./status");

const NotificationClass = require("./NotificationClass");

const CheckInformationClass = require("./CheckInformationClass");

const notificationList = require("./notificationList");

route.post("/", async (req, res) => {
  try {
    const dt = req.body; // Check if the user exists.

    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(dt.senderPhone, dt.senderUid); // Check the if the receiver exist

    const receiverInfo = await userIns.getUserByPhone(dt.receiverPhone); // Check if the price exist.
    // const checkInstance = new CheckInformationClass();

    if (dt.senderPayer === false && dt.receiverPayer === false) {
      throw new Error("No payer specified");
    } // // Check if the delivery is not duplicated


    const deliveryManager = new DeliveryManagerClass(); // const deliveryDuplicated =
    //   await deliveryManager.onGoingDeliveryIsDuplicated(
    //     dt.senderPhone,
    //     dt.receiverPhone
    //   );
    // Retrieve the location

    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(dt.senderLongitude, dt.senderLatitude); // Create the delivery

    const deliveryParam = { ...dt,
      ...location
    };
    const result = await deliveryManager.createDelivery(deliveryParam); // Send notification to the receiver.

    const notification = new NotificationClass();
    const title = `${senderInfo.name} vient de vous envoyer une livraison..`;
    const bodyContent = "Veuillez confirmer pour recevoir la livraison.";
    await notification.sendNotification(title, bodyContent, receiverInfo.notificationToken); // Add notification to database.

    await notification.addNotification(result.id, notificationList.holdOnForADelivererSender, "sender", err => {
      throw err;
    });
    await notification.addNotification(result.id, notificationList.holdOnForADelivererReceiver, "receiver", err => {
      throw err;
    }); // Send a response.

    res.send({ ...deliveryParam,
      ...{
        deliveryStatus: status.waitingForReceiverConfirmation
      }
    });
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