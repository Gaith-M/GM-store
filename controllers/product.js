// middlewares
const { validationResult } = require("express-validator");
const model_select = require("../helper_functions/model_select");

// =====================
// add a product
// =====================
const add_product = async (req, res, next) => {
  const validation_results = validationResult(req);

  if (!validation_results.isEmpty())
    return res.json({
      result: false,
      errors: validation_results.array({ onlyFirstError: true }),
    });

  try {
    const { model_id, type } = req.body;

    // set which model to use
    const model = model_select(type);
    console.log(model);
    if (!model)
      res.status(400).json({ result: false, message: "invalid type" });

    // check if model_id isn't dupe
    const id_available = await model.findOne({ model_id });

    if (id_available)
      return res.status(409).json({
        result: false,
        message: "the provided model ID already exists",
      });

    // pick which model to use based on the type:
    const new_product = new model({});
    for (let prop in req.body) {
      if (req.body[prop] !== "type") {
        new_product[prop] = req.body[prop];
      }
    }

    const product = await new_product.save();

    res.status(201).json({ result: true, product });
  } catch (err) {
    next(err);
  }
};

// =====================
// get a product using its model id
// =====================
const get_product = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    let model = model_select(type);
    console.log(model);
    if (!model)
      return res.status(400).json({ result: false, message: "invalid type" });

    const product = await model.findOne({ model_id: id });

    if (!product)
      return res.status(404).json({ result: false, msg: "product not found" });

    res.status(200).json({ result: true, product });
  } catch (err) {
    next(err);
  }
};

// =====================
// search and filter items
// =====================
const search_products = async (req, res, next) => {
  try {
    return res.status(200).json({ result: true, products: req.products });
  } catch (err) {
    next(err);
  }
};

// =====================
// update a product
// =====================
const update_product = async (req, res, next) => {
  try {
    const { id, type } = req.params;

    let model = model_select(type);
    if (!model)
      return res.status(400).json({ result: false, message: "invalid type" });

    const fields_to_update = {};

    for (let prop in req.body) {
      fields_to_update[prop] = req.body[prop];
    }

    // check if product exists
    const exsit = await model.findOne({ model_id: id });
    if (!exsit)
      return res
        .status(404)
        .json({ result: false, message: "item does not exist" });

    const updated_product = await model.findOneAndUpdate(
      { model_id: id },
      fields_to_update,
      { new: true }
    );

    res.status(200).json({ result: true, updated_product });
  } catch (err) {
    next(err);
  }
};

// =====================
// delete a product
// =====================
const delete_product = async (req, res, next) => {
  try {
    const { id, type } = req.params;

    let model = model_select(type);
    if (!model)
      return res.status(400).json({ result: false, message: "invalid type" });

    const deleted_product = await model.findOneAndDelete(
      { model_id: id },
      { rawResult: true }
    );

    if (deleted_product.value === null)
      return res
        .status(404)
        .json({ result: false, message: "product does not exist" });

    res
      .status(200)
      .json({ result: true, message: "product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  add_product,
  get_product,
  search_products,
  update_product,
  delete_product,
};
