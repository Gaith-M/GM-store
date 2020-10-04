const increase_quantity = (array, name, qty) =>
  array.map((item) => {
    if (item.name === name) {
      item.quantity = item.quantity + qty;
      return item;
    } else {
      return item;
    }
  });

const get_total = (array) =>
  array.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

const exists_in_cart = (array, name, color, size) => {
  let exists = null;
  for (let item of array) {
    if (
      item.name === name &&
      item.sizes.indexOf(size) > -1 &&
      item.colors.indexOf(color) > -1
    ) {
      exists = true;
    }
  }

  return exists;
};

module.exports = { increase_quantity, get_total, exists_in_cart };
