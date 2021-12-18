const express = require('express');
const {
  getOverView,
  getTourView,
  getLoginView,
  getSignupView,
  getDashboardView,
  updateUser,
  getStatsView,
  getMyToursView,
} = require('../controllers/view.controllers');
const { alerts } = require('../middlewares/alertMiddleware');
const {
  authenticateView,
  authenticate,
} = require('../middlewares/auth.middlewares');

const router = express.Router();

router.use(alerts);

router.get('/', authenticateView, getOverView);
router.get('/tour/:slug', authenticateView, getTourView);
router.get('/login', authenticateView, getLoginView);
router.get('/signup', authenticateView, getSignupView);
router.get('/dashboard', authenticate, getDashboardView);
router.get('/stats', authenticate, getStatsView);
// router.post('/update-user', authenticate, updateUser)
router.patch('/update-user', authenticate, updateUser);
router.patch('/update-password', authenticate, updateUser);
router.get('/my-tours', authenticate, getMyToursView);
// router.get('/my-tours', createBookingCheckout, authenticate, getMyToursView)

module.exports = router;
