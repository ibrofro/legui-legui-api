const firebaseAdminSdk = require("firebase-admin");

const VerificationClass = require("./CheckInformationClass");

class NotificationClass extends VerificationClass {
  async sendNotification(title, body, userToken) {
    const message = {
      notification: {
        title: title,
        body: body
      },
      token: userToken,
      android: {
        notification: {
          sound: "default"
        }
      }
    };
    await firebaseAdminSdk.messaging().send(message);
    return true;
  }

  async addNotification(deliveryId, notificationText, ...other) {
    let senderGiven = null;
    let receiverGiven = null;
    let errFunction = null;
    other.forEach(element => {
      if (element === "sender") {
        senderGiven = true;
      } else if (element === "receiver") {
        receiverGiven = true;
      } else if (typeof element === "function" && errFunction === null) {
        errFunction = element;
      }
    }); // Check if function is given

    if (errFunction === null) {
      throw new Error("No error function passed.");
    } // Check if sender or receiver is passed.


    if (!receiverGiven && !senderGiven) {
      let err = new Error("Neither sender nor receiver is passed");
      errFunction(err);
      return false;
    } // Save a notification on Firestore.


    if (senderGiven) {
      await firebaseAdminSdk.firestore().collection("delivery").doc(deliveryId).update({
        senderNotification: firebaseAdminSdk.firestore.FieldValue.arrayUnion({
          text: notificationText,
          date: new Date(),
          seen: false
        })
      });
      console.log("Notification save for sender");
    }

    if (receiverGiven) {
      await firebaseAdminSdk.firestore().collection("delivery").doc(deliveryId).update({
        receiverNotification: firebaseAdminSdk.firestore.FieldValue.arrayUnion({
          text: notificationText,
          date: new Date(),
          seen: false
        })
      });
      console.log("Notification save for receiver");
    }

    return true;
  }

} // End of NotificationClass


module.exports = NotificationClass;