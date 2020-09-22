const Accessories = require("../models/Accessories");
const CoatsAndJackets = require("../models/Coats_and_Jackets");
const Dress = require("../models/Dresses");
const Footwear = require("../models/Footwear");
const Gown = require("../models/Gowns");
const Onepiece = require("../models/Onepiece");
const PantsAndShorts = require("../models/Pants_and_Shorts");
const Perfume = require("../models/Perfume");
const Robe = require("../models/Robes");
const Skirt = require("../models/Skirts");
const SocksAndHosiery = require("../models/Socks_and_Hosiery");
const Top = require("../models/Tops");
const Underwear = require("../models/Underwear");

module.exports = (type) => {
  switch (type.toUpperCase()) {
    case "Accessories".toUpperCase():
      return (model = Accessories);

    case "CoatsAndJackets".toUpperCase():
      return (model = CoatsAndJackets);

    case "Dress".toUpperCase():
      return (model = Dress);

    case "Footwear".toUpperCase():
      return (model = Footwear);

    case "Gown".toUpperCase():
      return (model = Gown);

    case "Onepiece".toUpperCase():
      return (model = Onepiece);

    case "PantsAndShorts".toUpperCase():
      return (model = PantsAndShorts);

    case "Perfume".toUpperCase():
      return (model = Perfume);

    case "Robe".toUpperCase():
      return (model = Robe);

    case "Skirt".toUpperCase():
      return (model = Skirt);

    case "SocksAndHosiery".toUpperCase():
      return (model = SocksAndHosiery);

    case "Top".toUpperCase():
      return (model = Top);

    case "Underwear".toUpperCase():
      return (model = Underwear);

    default:
      return null;
  }
};
