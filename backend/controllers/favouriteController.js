const Favourite = require("../models/Favourite");
const Property = require("../models/Property");

const getMyFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id }).populate(
      "property",
    );
    res.status(200).json(favourites);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch favourites",
      error: error.message,
    });
  }
};

const addFavourite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existingFavourite = await Favourite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFavourite) {
      return res
        .status(400)
        .json({ message: "Property already in favourites" });
    }

    const favourite = await Favourite.create({
      user: req.user._id,
      property: propertyId,
    });

    res.status(201).json({
      message: "Added to favourites",
      favourite,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add favourite",
      error: error.message,
    });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favourite = await Favourite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Removed from favourites" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove favourite",
      error: error.message,
    });
  }
};

module.exports = {
  getMyFavourites,
  addFavourite,
  removeFavourite,
};
