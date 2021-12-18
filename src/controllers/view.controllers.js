const Tour = require('../models/tour.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const AppError = require('../errors/app.error');
const { catchAsync } = require('../utils/api.utils');

exports.getOverView = catchAsync(async (req, res) => {
  // Get all tours data
  const tours = await Tour.find();

  // Render template with data
  res.render('overview', { title: 'All Tours', tours });
});

exports.getTourView = catchAsync(async (req, res, next) => {
  console.log('get tour', req.params.slug);
  // Get tour data including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // Check if tour exists
  if (!tour) {
    return next(new AppError('Tour does not exist'));
  }

  // Build template

  // Render template with data
  res.render('tour', { title: `${tour.name} Tour`, tour });
});

exports.getLoginView = catchAsync(async (req, res) => {
  // Render template
  res.render('login', { title: 'Log into your account' });
});

exports.getSignupView = catchAsync(async (req, res) => {
  // Render template
  res.render('signup', { title: 'Sign up for a free account' });
});

exports.getDashboardView = catchAsync(async (req, res) => {
  // Render template
  // if(!res.locals.isAuthenticated) {
  //     return res.redirect('/login')
  // }

  res.render('dashboard', { title: 'Your Dashboard' });
});

exports.getMyToursView = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ creator: req.user.id });
  const tourIds = bookings.map(booking => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.render('overview', { title: 'My Tours', tours });
});

exports.getStatsView = catchAsync(async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
});

exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );

  res.render('dashboard', { title: 'Your Dashboard', user: updatedUser });
});
