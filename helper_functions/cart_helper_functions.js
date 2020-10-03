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

module.exports = { increase_quantity, get_total };
