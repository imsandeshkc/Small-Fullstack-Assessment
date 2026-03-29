const express = require("express");
const {
  getMyFavourites,
  addFavourite,
  removeFavourite,
} = require("../controllers/favouriteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyFavourites);
router.post("/:propertyId", protect, addFavourite);
router.delete("/:propertyId", protect, removeFavourite);

module.exports = router;