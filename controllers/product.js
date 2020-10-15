// middlewares
const { validationResult } = require("express-validator");
const model_select = require("../helper_functions/model_select");
const extract_type = require("../helper_functions/extract_type");
const create_product = require("../helper_functions/create_product");
const create_update_object = require("../helper_functions/update_object");

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
    const { type } = req.body;

    const new_product = create_product(type, req.body);

    if (!new_product)
      return res.status(400).json({ result: false, message: "invalid type" });

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
  const { id } = req.params;
  // The id holds the type of the product. it will be used to select the correct model, then fetch the product using the whole id
  const [type] = extract_type(id);
  try {
    let model = model_select(type);

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
    const { id } = req.params;
    const [type] = extract_type(id);

    let model = model_select(type);
    if (!model)
      return res.status(400).json({ result: false, message: "invalid type" });

    const fields_to_update = create_update_object(req.body);

    // check if product exists
    const exsit = await model.findOne({ model_id: id });
    if (!exsit)
      return res
        .status(404)
        .json({ result: false, message: "item does not exist" });

    const updated_product = await model.findOneAndUpdate(
      { model_id: id },
      fields_to_update,
      { new: true, useFindAndModify: false }
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
    const { id } = req.params;
    const [type] = extract_type(id);

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
