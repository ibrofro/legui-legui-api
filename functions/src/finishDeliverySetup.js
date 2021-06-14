/*
 * @flow
 */
const app = require("express");
const route: any = app.Router();
const functions = require("firebase-functions");
const DeliveryManagerClass = require("./DeliveryManagerClass");
const ApiCommunicationClass = require("./ApiCommunicationClass");
const UserClass = require("./UserClass");
const status = require("./status");
const CheckInformationClass = require("./CheckInformationClass");
const NotificationClass = require("./NotificationClass");
const notificationList = require("./notificationList");
route.post("/", async (req, res) => {
  try {
    const dt = req.body;

    // Get the delivery
    const deliveryManager = new DeliveryManagerClass();
    const delivery = await deliveryManager.getDeliveryById(dt.deliveryId);

    // Verify the status.
    const statusFromDb = delivery.status;
    switch (statusFromDb) {
      case status.senderRegionNotValid:
        throw new Error("sender region not invalid");

      case status.receiverRegionNotValid:
        throw new Error("receiver region not invalid");

      case status.waitingForADeliverer:
        throw new Error("Delivery already setup");
    }

    // Check if the user exists.
    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(
      dt.receiverPhone,
      dt.receiverUid
    );

    // Check if user is part of the delivery
    const phoneBelongToDelivery =
      await deliveryManager.checkIfPhoneBelongToTheDelivery(
        dt.receiverPhone,
        delivery.senderPhone,
        delivery.receiverPhone,
        (err) => {
          console.error(err);
          throw err;
        }
      );

    // Retrieve the location of the user.
    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(
      dt.receiverLongitude,
      dt.receiverLatitude
    );

    // Check if the receiver region is valid.
    const checkInstance = new CheckInformationClass();
    checkInstance.checkIfRegionIsValid(location.region);

    // Retrieve the distance.
    const distance = await apiCom.getDistance({
      senderLon: delivery.senderLongitude,
      senderLat: delivery.senderLatitude,
      receiverLon: dt.receiverLongitude,
      receiverLat: dt.receiverLatitude,
    });

    // Block the delivery when the distance is less than
    // 100 meters.
    if (distance.distanceInMeters < 75) {
      let err: any = new Error(status.closeDistance);
      err.userMustBeNotified = status.closeDistance;
      throw err;
    }

    // Get the price
    const resultOfCalculation = deliveryManager.calculatePrice(
      distance.distanceInMeters,
      180
    );
    let dataToAdd = {
      receiverUid: checkInstance.checkIfExist(dt.receiverUid),
      receiverLongitude: checkInstance.checkCoordinates(
        dt.receiverLongitude,
        dt.receiverLatitude
      ).lon,
      receiverLatitude: dt.receiverLatitude,
      receiverRegion: checkInstance.checkIfRegionIsValid(location.region),
      receiverCity: location.city,
      receiverAddress: location.displayName,
      receiverNotificationToken: checkInstance.checkIfExist(
        dt.receiverNotificationToken
      ),
      price: `${resultOfCalculation.price}`,
    };

    // Update the delivery on the database
    const result = await deliveryManager.updateDeliveryOnDb(dt.deliveryId, {
      ...dataToAdd,
      ...{ status: status.waitingForADeliverer },
    });

    // Send notification to the receiver.
    const notification = new NotificationClass();
    const title = `${
      delivery.receiverName || delivery.receiverPhone
    } vient de  confimer la livraison.`;
    const bodyContent = "Un livreur est en route pour effectuer la livraison.";
    await notification.sendNotification(
      title,
      bodyContent,
      delivery.senderNotificationToken
    );
    // Add notification to database.
    await notification.addNotification(
      dt.deliveryId,
      notificationList.configDoneBoth,
      "sender",
      "receiver",
      (err) => {
        throw err;
      }
    );
    // Send a response.
    res.send({
      ...dataToAdd,
      ...{ deliveryStatus: status.waitingForADeliverer },
    });
  } catch (error) {
    if (error.userMustBeNotified) {
      console.log(`${error.stack}`);
      switch (error.userMustBeNotified) {
        case status.regionNotValid:
          (async () => {
            const deliveryManager = new DeliveryManagerClass();
            const result = await deliveryManager.updateDeliveryOnDb(
              req.body.deliveryId,
              {
                status: status.receiverRegionNotValid,
              }
            );
          })();
          break;

        case status.closeDistance:
          (async () => {
            const deliveryManager = new DeliveryManagerClass();
            const result = await deliveryManager.updateDeliveryOnDb(
              req.body.deliveryId,
              {
                status: status.closeDistance,
              }
            );
          })();
          break;
      }
      res.status(500);
      res.json({ deliveryStatus: status.receiverRegionNotValid });
    } else {
      console.log(`${error.stack}`);
      res.status(500);
      res.send("An error occurred");
    }
  }
});
module.exports = route;
