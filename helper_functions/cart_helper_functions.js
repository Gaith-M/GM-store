const increase_quantity = (array, name, color, size, qty) =>
  array.map((item) => {
    if (item.name === name && item.colors === color && item.sizes === size) {
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
    if (item.name === name && item.sizes === size && item.colors === color) {
      exists = true;
    }
  }
  return exists;
};

module.exports = { increase_quantity, get_total, exists_in_cart };
