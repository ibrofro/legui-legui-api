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

}

module.exports = NotificationClass;