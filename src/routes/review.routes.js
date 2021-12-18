const express = require('express');
const {
  createReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
} = require('../controllers/review.controllers');
const {
  authenticate,
  authorize,
  hasBooking,
} = require('../middlewares/auth.middlewares');

// NESTED ROUTES - finalize nested routing to merge params from parent route into nested route
const router = express.Router({ mergeParams: true });

// router.param('id', checkIfExistsMiddleware)

// Authenticate all routes after this middleware
router.use(authenticate);

router
  .route('/')
  .post(
    authorize('user'),
    (req, res, next) => {
      if (!req.body.tour) req.body.tour = req.params.tourId;
      if (!req.body.creator) req.body.creator = req.user.id;
      next();
    },
    hasBooking,
    createReview
  )
  .get((req, res, next) => {
    if (req.params.tourId) req.query.tour = req.params.tourId;
    next();
  }, getAllReviews);

router
  .route('/:id')
  .patch(authorize('user', 'admin'), updateReview)
  .get(getReview)
  .delete(authorize('user', 'admin'), deleteReview);

module.exports = router;
