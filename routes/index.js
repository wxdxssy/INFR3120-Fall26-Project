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

// Edit a saved review: load existing values into the edit form.
router.get('/reviews/:id/edit', async function(req, res, next) {
  try {
    if (!Review.db.base.isValidObjectId(req.params.id)) return res.sendStatus(404);
    const review = await Review.findById(req.params.id);
    if (!review) return res.sendStatus(404);
    res.render('review-edit', { review, error: '' });
  } catch (err) {
    next(err);
  }
});

// Save an edited review with the same validation rules as creating one.
router.post('/reviews/:id/edit', async function(req, res, next) {
  try {
    if (!Review.db.base.isValidObjectId(req.params.id)) return res.sendStatus(404);
    const savedReview = await Review.findById(req.params.id);
    if (!savedReview) return res.sendStatus(404);

    const input = req.body || {};
    const fields = ['restaurant', 'dish', 'price', 'rating', 'comment'];
    let error = '';
    for (const field of fields) {
      if (typeof input[field] !== 'string' || input[field].trim() === '') {
        error = 'Please fill in all five fields.';
        break;
      }
    }

    if (!error && !['1', '2', '3', '4', '5'].includes(input.rating)) {
      error = 'Choose a whole-number rating from 1 to 5.';
    }
    const price = Number(input.price);
    if (!error && (!Number.isFinite(price) || price < 0)) {
      error = 'Enter a valid price of $0 or more.';
    }

    if (error) {
      return res.status(400).render('review-edit', {
        review: { _id: savedReview._id, ...input },
        error
      });
    }

    savedReview.restaurant = input.restaurant.trim();
    savedReview.dish = input.dish.trim();
    savedReview.price = price;
    savedReview.rating = Number(input.rating);
    savedReview.comment = input.comment.trim();
    await savedReview.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Delete only the selected review and return to the homepage.
router.post('/reviews/:id/delete', async function(req, res, next) {
  try {
    if (!Review.db.base.isValidObjectId(req.params.id)) return res.sendStatus(404);
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.sendStatus(404);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
