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
      senderLocation: new firebaseAdminSdk.firestore.GeoPoint(parseInt(senderCoordinatesVerified.lat), parseInt(senderCoordinatesVerified.lon)),
      senderCity: params.city ? String(params.city) : "",
      senderAddress: params.displayName ? String(params.displayName) : "",
      senderRegion: super.checkIfRegionIsValid(params.region),
      status: status.waitingForADeliverer,
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

  async checkIfPhoneBelongToTheDelivery(phone, deliveryId) {
    const documentSnapshot = await this.collection.doc(deliveryId).get();

    if (documentSnapshot.exists) {
      const senderPhone = documentSnapshot.data().senderPhone;
      const receiverPhone = documentSnapshot.data().receiverPhone;

      if (senderPhone === phone || receiverPhone === phone) {
        return documentSnapshot.data();
      } else {
        throw new Error("This phone number is not part on the delivery");
      }
    } else {
      throw new Error("This phone number is not part on the delivery");
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

}

module.exports = DeliveryManagerClass;