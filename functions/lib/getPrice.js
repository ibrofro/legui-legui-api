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
    // Verify if the status wasn't wasn't region-not-valid.//
    /////////////////////////////////////////////////////////

    const statusFromDb = delivery.status;

    if (statusFromDb === status.senderRegionNotValid || statusFromDb === status.receiverRegionNotValid) {
      throw new Error("region was invalid");
    } // Check if the user exists.


    const userIns = new UserClass();
    const senderInfo = await userIns.doesUserExists(dt.receiverPhone, dt.receiverUid); // Check if user is part of the delivery

    const phoneBelongToDelivery = await deliveryManager.checkIfPhoneBelongToTheDelivery(delivery.receiverPhone, dt.senderPhone, dt.receiverPhone, err => {
      console.error(err);
      throw err;
    }); // Check if the price is already set.
    // const priceIsSet = await deliveryManager.priceAlreadySet(
    //   phoneBelongToDelivery
    // );
    // Retrieve the location of the user.

    const apiCom = new ApiCommunicationClass();
    const location = await apiCom.geoLocateUser(dt.receiverLongitude, dt.receiverLatitude); // Check if the receiver region is valid.

    const checkInstance = new CheckInformationClass();
    checkInstance.checkIfRegionIsValid(location.region); // Retrieve the distance.

    const distance = await apiCom.getDistance({
      senderLon: dt.senderLongitude,
      senderLat: dt.senderLatitude,
      receiverLon: dt.receiverLongitude,
      receiverLat: dt.receiverLatitude
    }); // Get the price

    const resultOfCalculation = deliveryManager.calculatePrice(distance.distanceInMeters, 180); // Update the price on the database

    const result = deliveryManager.updateDeliveryOnDb(dt.deliveryId, {
      price: `${resultOfCalculation.price}`
    }); // Send a response.

    res.send(resultOfCalculation);
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