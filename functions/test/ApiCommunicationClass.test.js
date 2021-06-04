const ApiCommunicationClass = require("../src/ApiCommunicationClass");
const comInstance = new ApiCommunicationClass();

// test("Test the location fetcher", async () => {
//   const longitude = "-17.44581699371338";
//   const latitude = "14.70868574295506";

//   const returned = await comInstance.geoLocateUser(longitude,latitude);
//   expect(returned).toBeTruthy();
// });

test("Test the distance fetcher", async () => {
  const params_needed = {
    senderLon: "-17.515296936035156",
    senderLat: "14.740686816554593",
    receiverLon: "-17.44581699371338",
    receiverLat: "14.70868574295506",
  };

  const returned = await comInstance.getDistance(params_needed);
  expect(returned).toBeTruthy();
});


