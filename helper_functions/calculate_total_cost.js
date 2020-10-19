module.exports = (arr) => {
  let total = 0;

  for (item of arr) {
    total += item.price * item.quantity;
  }

  return total;
};
