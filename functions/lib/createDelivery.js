const app = require("express");

const route = app.Router();

const functions = require("firebase-functions");

const DeliveryManagerClass = require("./DeliveryManagerClass");

const ApiCommunicationClass = require("./ApiCommunicationClass");

const UserClass = require("./UserClass");

const NotificationClass = require("./NotificationClass");

route.post("/", async (req, res) => {
  try {
    const dt = req.body; // Check if the user exists.

    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(dt.senderPhone, dt.senderUid); // Retrieve the location

    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(dt.senderLongitude, dt.senderLatitude); // Send notification to the receiver.

    const receiverInfo = await userIns.getUserByPhone(dt.receiverPhone);
    const notification = new NotificationClass();
    const title = `${senderInfo.name} vient de vous envoyer une livraison..`;
    const bodyContent = "Veuillez confirmer pour recevoir la livraison.";
    await notification.sendNotification(title, bodyContent, receiverInfo.notificationToken); // Create the delivery

    const deliveryManager = new DeliveryManagerClass();
    const deliveryParam = { ...dt,
      ...location
    };
    const created = await deliveryManager.createDelivery(deliveryParam); // Send a response.

    res.send({ ...deliveryParam,
      ...{
        deliveryStatus: "waiting-for-receiver-confirmation"
      }
    });
  } catch (error) {
    console.log(`${error.stack}`);
    res.status(500);
    res.send("An error occurred");
  }
});
module.exports = route;