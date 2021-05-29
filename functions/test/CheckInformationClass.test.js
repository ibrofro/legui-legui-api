const CheckInformationClass = require("../src/CheckInformationClass");
const checkInfoInstance = new CheckInformationClass();

test("CheckInformationClass.js test", async () => {
  expect(() => checkInfoInstance.checkName("ibro")).not.toThrow(Error);
});
