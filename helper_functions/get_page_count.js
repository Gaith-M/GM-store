module.exports = (total, limit) => {
  let remainder = total % limit;
  if (remainder > 0) {
    let rounded_page_count = total - remainder;
    let page_count = rounded_page_count / limit + 1;
    return page_count;
  }
  return total / limit;
};
