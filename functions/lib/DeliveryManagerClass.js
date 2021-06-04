const firebaseAdminSdk = require("firebase-admin");

const CheckInformationClass = require("./CheckInformationClass.js");

const status = require("./status");

class DeliveryManagerClass extends CheckInformationClass {
  constructor() {
    super();
    this.collection = firebaseAdminSdk.firestore().collection("delivery");
  }

  async createDelivery(params) {
    const senderUidVerified = super.checkIfExist(params.senderUid);
    const senderNameVerified = super.checkName(params.senderName);
    const receiverNameVerified = super.checkName(params.receiverName);
    const senderPhoneVerified = super.checkSnPhone(params.senderPhone);
    const receiverPhoneVerified = super.checkSnPhone(params.receiverPhone);
    const senderNotificationTokenVerified = super.checkIfExist(params.senderNotificationToken);
    const senderCoordinatesVerified = super.checkCoordinates(params.senderLongitude, params.senderLatitude);
    const senderRegionVerified = super.checkIfRegionIsValid(params.region); // Put verified information on the
    // delivery collection.

    const result = await this.collection.add({
      phoneArray: [senderPhoneVerified, receiverPhoneVerified],
      senderUid: senderUidVerified,
      senderName: senderNameVerified,
      senderPhone: senderPhoneVerified,
      receiverName: receiverNameVerified,
      receiverPhone: receiverPhoneVerified,
      senderNotificationToken: senderNotificationTokenVerified,
      senderLongitude: senderCoordinatesVerified.lon,
      senderLatitude: senderCoordinatesVerified.lat,
      senderCity: params.city ? String(params.city) : "",
      senderAddress: params.displayName ? String(params.displayName) : "",
      senderRegion: super.checkIfRegionIsValid(params.region),
      status: status.waitingForReceiverConfirmation,
      createdAt: new Date(),
      price: ""
    });

    if (result.id) {
      return true;
    } else {
      throw new Error("Error while adding the delivery to Firestore");
    }
  }

  async onGoingDeliveryIsDuplicated(senderPhone, receiverPhone) {
    const senderPhoneVerified = this.checkSnPhone(senderPhone);
    const receiverPhoneVerified = this.checkSnPhone(receiverPhone);
    const collection = firebaseAdminSdk.firestore().collection("delivery");
    const querySnapshot = await collection.where("senderPhone", "==", senderPhoneVerified).where("receiverPhone", "==", receiverPhoneVerified).get();

    if (!querySnapshot.empty) {
      let found = false;
      querySnapshot.forEach(documentSnapshot => {
        const dt = documentSnapshot.data();
        console.log(dt.status);

        if (dt.status === status.waitingForReceiverConfirmation || dt.status === status.waitingForADeliverer || dt.status === status.onDelivery) {
          found = true;
        }
      });

      if (found) {
        // At this point duplicated delivery is found.
        let err = new Error(status.ongoingDeliveryCannotBeDuplicated);
        err.userMustBeNotified = status.ongoingDeliveryCannotBeDuplicated;
        throw err;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async checkIfPhoneBelongToTheDelivery(receiverPhone, senderPhoneOnDb, receiverPhoneOnDb, errorHandler) {
    if (receiverPhone === senderPhoneOnDb || receiverPhone === receiverPhoneOnDb) {
      return true;
    } else {
      const err = new Error("This phone number is not part on the delivery");
      return errorHandler(err);
    }
  }

  async priceAlreadySet(deliveryObj) {
    const price = deliveryObj.price;

    if (!price) {
      return true;
    } else {
      throw new Error("Price already set");
    }
  }

  calculatePrice(distanceInMeters, priceByKilometers) {
    if (distanceInMeters && priceByKilometers) {
      if (distanceInMeters <= 8500) {
        return {
          price: 1500
        };
      }

      const price = Math.round(Math.round(distanceInMeters * priceByKilometers / 1000) / 100) * 100;
      return {
        price: price
      };
    } else {
      throw new Error("Error while calculating the price,");
    }
  }

  async updateDeliveryOnDb(deliveryId, params) {
    await this.collection.doc(deliveryId).update(params);
    return params;
  }

  async getDeliveryById(deliveryId) {
    const delivery = await this.collection.doc(deliveryId).get();
    return delivery.data();
  }

}

module.exports = DeliveryManagerClass;