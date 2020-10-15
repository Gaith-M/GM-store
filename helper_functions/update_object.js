module.exports = (obj) => {
  console.log("running");
  const new_object = {};

  for (let prop in obj) {
    new_object[prop] = obj[prop];
  }

  return new_object;
};
