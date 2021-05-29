const CheckInformationClass = require("../src/CheckInformationClass");
const checkInfoInstance = new CheckInformationClass();

test("checkName ",  () => {
  expect(checkInfoInstance.checkName("ibro")).toBe("Ibro");
});

test("checkIfRegionIsValid ",  () => {
  expect(checkInfoInstance.checkIfRegionIsValid("dakar")).toBeTruthy();
});
