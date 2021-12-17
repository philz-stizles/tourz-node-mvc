import express from 'express';
import {
  getCheckoutSession,
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getBooking,
} from '../controllers/booking.controllers';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middlewares';

const router = express.Router();

// Authenticate all routes after this middleware
router.use(isAuthenticated);

router.get('/checkoutSession/:tourId', getCheckoutSession);

router.use(isAuthorized('admin', 'lead-guide'));

router.route('/').post(createBooking).get(getAllBookings);

router.route('/:id').patch(updateBooking).get(getBooking).delete(deleteBooking);

export default router;
