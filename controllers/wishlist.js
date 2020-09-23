const { model } = require("../models/user");
const User = require("../models/user");
// =================================
// The Wishlist is a part of the user model and endpoints. however, it has been placed in a different file for easier managment
// =================================

// ======================
// toggle item's presence in wishlist
// ======================
const toggle_item_in_wishlist = async (req, res, next) => {
  // get the user's document. check its wishlist. if the item doesn't exist in it, add it, if it does, remove it, then save the document
  try {
    console.log("controller running");
    const { model_id } = req.body;
    const { id } = req.user;

    const doc = await User.findOne({ _id: id });

    const item_index = doc.wishlist.indexOf(model_id);

    // if item is already in wishlist, remove it
    if (item_index > -1) {
      const updated_document = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { wishlist: { $in: model_id } } },
        { new: true, useFindAndModify: false }
      );

      return res.status(200).json({ result: updated_document });
    } else {
      // add it
      const updated_document = await User.findOneAndUpdate(
        { _id: id },
        { $push: { wishlist: model_id } },
        { new: true, useFindAndModify: false }
      );
      return res.status(200).json({ result: updated_document });
    }
  } catch (err) {
    next(err);
  }
};

// ======================
// toggle item's presence in wishlist
// ======================
const clear_wishlist = async (req, res, next) => {
  try {
    const { id } = req.user;

    const updated_document = await User.findOneAndUpdate(
      { _id: id },
      { wishlist: [] },
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({ result: updated_document });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggle_item_in_wishlist, clear_wishlist };
