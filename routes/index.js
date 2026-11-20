const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Display reviews from MongoDB, newest first
router.get('/', async function(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('index', { reviews: reviews });
  } catch (err) {
    next(err);
  }
});

// Display Waseedullah's review form
router.get('/reviews/new', function(req, res) {
  res.render('review-form', { error: '' });
});

// Validate and save a review
router.post('/reviews', async function(req, res, next) {
  const review = req.body || {};
  const fields = ['restaurant', 'dish', 'price', 'rating', 'comment'];

  for (let i = 0; i < fields.length; i++) {
    const value = review[fields[i]];

    if (typeof value !== 'string' || value.trim() === '') {
      return res.status(400).render('review-form', {
        error: 'Please fill in all five fields.'
      });
    }
  }

  const rating = review.rating;

  if (rating !== '1' && rating !== '2' &&
      rating !== '3' && rating !== '4' &&
      rating !== '5') {
    return res.status(400).render('review-form', {
      error: 'Choose a whole-number rating from 1 to 5.'
    });
  }

  const price = Number(review.price);

  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).render('review-form', {
      error: 'Enter a valid price of $0 or more.'
    });
  }

  try {
    await Review.create({
      restaurant: review.restaurant.trim(),
      dish: review.dish.trim(),
      price: price,
      rating: Number(rating),
      comment: review.comment.trim()
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
