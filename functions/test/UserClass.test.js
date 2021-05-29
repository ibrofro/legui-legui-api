const userClass = require("../src/UserClass");
const userInstance = new userClass(
    "2KRN0FpAYlgIFgEHQCbV3tqhTQI2",
  "+221774662232"
);

test("Test: check if the user exist ", async () => {
  // By tweaking the values you
  // can test methods.
  const returned = await userInstance.doesUserExists();
  console.log(returned);
  expect(returned).toBeTruthy();
}); 
