const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

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

app.listen(port, function () {
  console.log(`Campus Bites is running at http://localhost:${port}`);
});