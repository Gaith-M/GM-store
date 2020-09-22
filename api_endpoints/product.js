const router = require("express").Router();
const auth = require("../middlewares/auth");
const has_role = require("../middlewares/has_role");
const { body } = require("express-validator");
// =================
// Controllers
// =================
const {
  add_product,
  get_product,
  search_products,
  update_product,
  delete_product,
} = require("../controllers/product");

// =================
// Middlewears
// =================
const filtered_search = require("../middlewares/filtered_search");
const pagniated_results = require("../middlewares/pagination");

// ======================
// @Path: api/search/:sex/:type[query string]
// @Type: Public
// @Desc: Get products by its type and sex
// ======================
router.get(
  "/search/:sex/:type",
  filtered_search,
  pagniated_results,
  search_products
);

// ======================
// @Path: api/:type/:id
// @Type: Public
// @Desc: Get a product by its model id and type
// ======================
router.get("/:type/:id", get_product);

// ======================
// @Path: api/product
// @Type: Privet
// @Desc: post a product - for admin only
// ======================
router.post(
  "/add",
  auth,
  has_role("admin"),
  [
    body("type").exists().withMessage("product type is required"),
    body("sex").exists().withMessage("name is required"),
    body("name").exists().withMessage("name is required"),
    body("category").exists().withMessage("category is required"),
    body("tags").exists().withMessage("tags is required"),
    body("brand").exists().withMessage("brand is required"),
    body("description").exists().withMessage("description is required"),
    body("price").exists().withMessage("price is required"),
    body("quantity").exists().withMessage("quantity is required"),
    body("photos").exists().withMessage("photos are required"),
    body("colors"),
    body("discounted"),
    body("sizes"),
  ],
  add_product
);

// ======================
// @Path: api/product/:id
// @Type: Privet
// @Desc: update a product using its model number - for admin only
// ======================
router.patch("/:type/:id", auth, has_role("admin"), update_product);

// ======================
// @Path: api/product/:id
// @Type: Privet
// @Desc: delete a product using its model number - for admin only
// ======================
router.delete("/:type/:id", auth, has_role("admin"), delete_product);

module.exports = router;
