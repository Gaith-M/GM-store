const get_page_count = require("../helper_functions/get_page_count");

module.exports = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const document_count = req.products.length;

    const total_pages = get_page_count(document_count, limit);
    const start_index = (page - 1) * limit;
    const end_index = page * limit;

    const results = {};
    if (page > 1) results.previous = { page: page - 1, limit };
    if (end_index < document_count) results.next = { page: page + 1, limit };

    results.results = req.products.slice(start_index, end_index);

    req.products = results;

    next();
  } catch (err) {
    next(err);
  }
};
