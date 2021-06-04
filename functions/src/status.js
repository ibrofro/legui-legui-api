/*
 * @flow
 *
 */

const status = {
  waitingForReceiverConfirmation: "waiting-for-receiver-confirmation",
  waitingForADeliverer: "waiting-for-a-deliverer",
  onDelivery: "on-delivery",
  deliveryCompleted: "delivery-completed",
  regionNotValid: "region-not-valid",
  senderRegionNotValid:"sender-region-not-valid",
  receiverRegionNotValid:"receiver-region-not-valid",
  abortedBySender: "aborted-by-sender",
  abortedByReceiver: "aborted-by-receiver",
  ongoingDeliveryCannotBeDuplicated:"ongoing-delivery-cannot-be-duplicated"
};

module.exports = status;
