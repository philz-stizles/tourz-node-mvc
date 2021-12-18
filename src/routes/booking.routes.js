const express = require('express');
const {
  getCheckoutSession,
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getBooking,
} = require('../controllers/booking.controllers');
const { authenticate, authorize } = require('../middlewares/auth.middlewares');

const router = express.Router();

// Authenticate all routes after this middleware
router.use(authenticate);

router.get('/checkoutSession/:tourId', getCheckoutSession);

router.use(authorize('admin', 'lead-guide'));

router
  .route('/')
  .post(createBooking)
  .get((req, res, next) => {
    if (req.params.tourId) req.query.tour = req.params.tourId;
    if (req.params.userId) req.query.creator = req.user.id;
    next();
  }, getAllBookings);

router.route('/:id').patch(updateBooking).get(getBooking).delete(deleteBooking);

module.exports = router;
