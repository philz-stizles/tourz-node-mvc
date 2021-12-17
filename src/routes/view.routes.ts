import express from 'express';
import {
  getOverView,
  getTourView,
  getLoginView,
  getSignupView,
  getDashboardView,
  updateUser,
  getStatsView,
  getMyToursView,
} from '../controllers/view.controllers';
import { alerts } from '../middlewares/alert.middleware';
import {
  isAuthenticatedView,
  isAuthenticated,
} from '../middlewares/auth.middlewares';

const router = express.Router();

router.use(alerts);

router.get('/', isAuthenticatedView, getOverView);
router.get('/tour/:slug', isAuthenticatedView, getTourView);
router.get('/login', isAuthenticatedView, getLoginView);
router.get('/signup', isAuthenticatedView, getSignupView);
router.get('/dashboard', isAuthenticated, getDashboardView);
router.get('/stats', isAuthenticated, getStatsView);
// router.post('/update-user', isAuthenticated, updateUser)
router.patch('/update-user', isAuthenticated, updateUser);
router.patch('/update-password', isAuthenticated, updateUser);
router.get('/my-tours', isAuthenticated, getMyToursView);
// router.get('/my-tours', createBookingCheckout, isAuthenticated, getMyToursView)

module.exports = router;
