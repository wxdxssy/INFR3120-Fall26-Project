const mongoose = require("mongoose");

// One student food review — matches the five agreed field names.
const reviewSchema = new mongoose.Schema(
  {
    restaurant: { type: String, required: true, trim: true },
    dish:       { type: String, required: true, trim: true },
    price:      { type: Number, required: true, min: 0 },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, required: true, trim: true }
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model("Review", reviewSchema);
