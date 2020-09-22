const model_select = require("../helper_functions/model_select");

module.exports = async (req, res, next) => {
  try {
    const { type, sex } = req.params;
    let tags = req.query.tags || [];

    if (typeof tags === "string") {
      tags = tags.split(",");
    }

    const model = model_select(type);
    if (!model)
      return res.status(400).json({ result: false, message: "invalid type" });

    const from = req.query.from || 0;
    const to = req.query.to || 999999;
    const inStock = req.query.inStock === "true" ? true : false || false;
    const rating = req.query.rating || 0;

    search_conditions = {
      sex,
      price: { $gte: from, $lte: to },
      quantity: { $gte: inStock ? 1 : 0 },
      "rating.overall": { $gte: rating },
    };

    tags.length > 0 ? (search_conditions.tags = { $in: tags }) : null;

    const products = await model
      .find(search_conditions)
      .select("name brand price sex quantity tags -_id");

    req.products = products;
    next();
  } catch (err) {
    next(err);
  }
};
