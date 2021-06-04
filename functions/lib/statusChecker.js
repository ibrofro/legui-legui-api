const status = require("../src/status.js");

const statusExist = arg => {
  if (typeof arg === "string") {
    for (const key in status) {
      if (arg === status[key]) {
        return true;
      }
    }

    let err = new Error("not-found");
    return err;
  } else {
    let err = new Error("not-a-string");
    return err;
  }
};

const statusExistArr = arg => {
  // Check if argument is an array
  if (!Array.isArray(arg)) {
    let err = new Error("invalid-argument");
    return err;
  } // Check if every items on arg is a valid status
  // by adding founded one on an array.


  const found = [];

  for (let i = 0; i < arg.length; i++) {
    for (const key in status) {
      if (status[key] === arg[i]) {
        found.push(status[key]);
      }
    }
  } // Find the not founded one
  // an notify the user.


  let notFound = [];

  for (let i = 0; i < arg.length; i++) {
    if (!found.includes(arg[i])) {
      notFound.push(arg[i]);
    }
  }

  if (notFound.length > 0) {
    let err = new Error("invalid-status");
    err.notFound = notFound;
    return err;
  } else {
    return true;
  }
};

function isDifferentToConstructor(firstArgToCompare) {
  this.firstArgToCompare = firstArgToCompare;

  this.getIt = function () {
    return this.firstArgToCompare;
  };

  this.isDifferentTo = function (arg) {
    // check the type of the argument.
    const checking = statusExistArr(arg);

    if (checking instanceof Error) {
      switch (checking.message) {
        case "invalid-argument":
          throw new Error("Argument(s) passed to isDifferentTo must be an array.");

        case "invalid-status":
          throw new Error(`isDifferentTo contains invalid status(es) [${checking.notFound}]`);

        default:
          throw new Error("An error exist on statusChecker");
      }
    }

    console.log("The first argument is ==> " + this.getIt());
  };

  return this.isDifferentTo;
}

const statusChecker = statusArg => {
  // Check if the status is
  // valid
  const checking = statusExist(statusArg);

  if (checking instanceof Error) {
    switch (checking.message) {
      case "not-found":
        throw new Error("Argument passed to statusChecker is not a valid status.");

      case "not-a-string":
        throw new Error("statusChecker only accept string as valid argument. ");

      default:
        throw new Error("An error exist on statusChecker");
    }
  }

  console.log(statusArg);
  return {
    isDifferentTo: new isDifferentToConstructor(statusArg)
  };
};

module.exports = {
  isDifferentToConstructor,
  statusChecker,
  statusExistArr,
  statusExist
};