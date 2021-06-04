const app = require("express");

const route = app.Router();

const functions = require("firebase-functions");

const DeliveryManagerClass = require("./DeliveryManagerClass");

const ApiCommunicationClass = require("./ApiCommunicationClass");

const UserClass = require("./UserClass");

const status = require("./status");

const CheckInformationClass = require("./CheckInformationClass");

route.post("/", async (req, res) => {
  try {
    const dt = req.body; // Get the delivery

    const deliveryManager = new DeliveryManagerClass();
    const delivery = await deliveryManager.getDeliveryById(dt.deliveryId); /////////////////////////////////////////////////////////
    // Verify if the status wasn't wasn't region-not-valid.
    // or waiting-for-a deliverer.
    /////////////////////////////////////////////////////////

    const statusFromDb = delivery.status;

    switch (statusFromDb) {
      case status.senderRegionNotValid:
        throw new Error("sender region not invalid");

      case status.receiverRegionNotValid:
        throw new Error("receiver region not invalid");

      case status.waitingForADeliverer:
        throw new Error("Delivery already setup");
    } // Check if the user exists.


    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(dt.receiverPhone, dt.receiverUid); // Check if user is part of the delivery

    const phoneBelongToDelivery = await deliveryManager.checkIfPhoneBelongToTheDelivery(dt.receiverPhone, delivery.senderPhone, delivery.receiverPhone, err => {
      console.error(err);
      throw err;
    }); // Retrieve the location of the user.

    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(dt.receiverLongitude, dt.receiverLatitude); // Check if the receiver region is valid.

    const checkInstance = new CheckInformationClass();
    checkInstance.checkIfRegionIsValid(location.region); // Retrieve the distance.

    const distance = await apiCom.getDistance({
      senderLon: delivery.senderLongitude,
      senderLat: delivery.senderLatitude,
      receiverLon: dt.receiverLongitude,
      receiverLat: dt.receiverLatitude
    }); // Get the price

    const resultOfCalculation = deliveryManager.calculatePrice(distance.distanceInMeters, 180);
    let dataToAdd = {
      receiverUid: checkInstance.checkIfExist(dt.receiverUid),
      receiverLongitude: checkInstance.checkCoordinates(dt.receiverLongitude, dt.receiverLatitude).lon,
      receiverLatitude: dt.receiverLatitude,
      receiverRegion: checkInstance.checkIfRegionIsValid(location.region),
      receiverCity: location.city,
      receiverAddress: location.displayName,
      receiverNotificationToken: checkInstance.checkIfExist(dt.receiverNotificationToken),
      price: `${resultOfCalculation.price}`
    }; // Update the delivery on the database

    const result = await deliveryManager.updateDeliveryOnDb(dt.deliveryId, { ...dataToAdd,
      ...{
        status: status.waitingForADeliverer
      }
    }); // Send a response.

    res.send({ ...dataToAdd,
      ...{
        deliveryStatus: status.waitingForADeliverer
      }
    });
  } catch (error) {
    if (error.userMustBeNotified) {
      console.log(`${error.stack}`);

      if (error.userMustBeNotified === status.regionNotValid) {
        (async () => {
          const deliveryManager = new DeliveryManagerClass();
          const result = await deliveryManager.updateDeliveryOnDb(req.body.deliveryId, {
            status: status.receiverRegionNotValid
          });
        })();
      }

      res.status(500);
      res.json({
        deliveryStatus: status.receiverRegionNotValid
      });
    } else {
      console.log(`${error.stack}`);
      res.status(500);
      res.send("An error occurred");
    }
  }
});
module.exports = route;