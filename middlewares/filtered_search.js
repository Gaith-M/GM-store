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
    const to = req.query.to || 9999999;
    const rating = req.query.rating || 0;
    const category = req.query.category || null;

    search_conditions = {
      sex,
      price: { $gte: from, $lte: to },
      "rating.overall": { $gte: rating },
    };

    if (tags.length > 0) search_conditions.tags = { $in: tags };
    if (category) search_conditions.category = category;

    const products = await model
      .find(search_conditions)
      .select("name brand price category sex quantity tags model_id -_id");

    req.products = products;
    next();
  } catch (err) {
    next(err);
  }
};
