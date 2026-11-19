const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.get("/", function (req, res) {
  const review = {
    restaurant: "Example Shawarma Kitchen",
    dish: "Chicken shawarma wrap",
    price: "$11.99",
    rating: 4,
    comment: "Filling lunch for under $12."
  };

  res.render("index", { review: review });
});

app.get("/reviews/new", function (req, res) {
  res.render("review-form", { error: "" });
});

app.post("/reviews", function (req, res) {
  const review = req.body || {};
  const fields = ["restaurant", "dish", "price", "rating", "comment"];

  for (let i = 0; i < fields.length; i++) {
    const value = review[fields[i]];

    if (value == null || value === "") {
      return res.status(400).render("review-form", {
        error: "Please fill in all five fields."
      });
    }
  }

  const rating = review.rating;

  // The form sends each option value as text.
  if (rating !== "1" && rating !== "2" && rating !== "3" &&
    rating !== "4" && rating !== "5") {
    return res.status(400).render("review-form", {
      error: "Choose a whole-number rating from 1 to 5."
    });
  }

  const price = parseFloat(review.price);

  if (isNaN(price) || !isFinite(review.price) || price < 0) {
    return res.status(400).render("review-form", {
      error: "Enter a valid price of $0 or more."
    });
  }

  res.send("Review passed validation. Saving will be connected next.");
});

app.listen(port, function () {
  console.log(`Campus Bites is running at http://localhost:${port}`);
});