let express = require('express');
let router = express.Router();
let Review = require('../models/Review');

/* GET home page — list all reviews from MongoDB, newest first */
router.get('/', async function(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('index', { reviews: reviews });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
