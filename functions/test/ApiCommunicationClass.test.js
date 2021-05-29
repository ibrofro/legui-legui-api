
const ApiCommunicationClass = require("../src/ApiCommunicationClass");
const comInstance = new ApiCommunicationClass();

test("Test the location fetcher", async () => {
  const longitude = "-17.44581699371338";
  const latitude = "14.70868574295506";

  const returned = await comInstance.geoLocateUser(longitude,latitude);
  expect(returned).toBeTruthy();
});
