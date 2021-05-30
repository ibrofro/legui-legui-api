/*
 * @flow
 */
const firebaseAdminSdk = require("firebase-admin");
const VerificationClass = require("./CheckInformationClass");
class NotificationClass extends VerificationClass {
  async sendNotification(
    title: string,
    body: string,
    userToken: string
  ): Promise<boolean> {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: userToken,
      android: {
        notification: {
          sound: "default",
        },
      },
    };

    await firebaseAdminSdk.messaging().send(message);
    return true;
  }
}

module.exports = NotificationClass;
