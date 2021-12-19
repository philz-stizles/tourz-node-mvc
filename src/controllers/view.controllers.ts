import { NextFunction, Request, Response } from 'express';
import AppError from '@src/errors/app.error';
import { catchAsync } from '@src/utils/api.utils';
// Models.
import Tour from '@src/models/tour.model';
import User from '@src/models/user.model';
import Booking from '@src/models/booking.model';

export const getOverView = catchAsync(async (req: Request, res: Response) => {
  // Get all tours data
  const tours = await Tour.find();

  // Build template

  // Render template with data
  res.render('overview', { title: 'All Tours', tours });
});

export const getTourView = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('get tour', req.params.slug);
    // Get tour data including reviews and guides
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user'
    });

    // Check if tour exists
    if (!tour) {
      return next(new AppError(404, 'Tour does not exist'));
    }

    // Build template

    // Render template with data
    res.render('tour', { title: `${tour.name} Tour`, tour });
  }
);

export const getLoginView = catchAsync(async (req: Request, res: Response) => {
  // Render template
  res.render('login', { title: 'Log into your account' });
});

export const getSignupView = catchAsync(async (req: Request, res: Response) => {
  // Render template
  res.render('signup', { title: 'Sign up for a free account' });
});

export const getDashboardView = catchAsync(
  async (req: Request, res: Response) => {
    // Render template
    // if(!res.locals.isAuthenticated) {
    //     return res.redirect('/login')
    // }

    res.render('dashboard', { title: 'Your Dashboard' });
  }
);

export const getMyToursView = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await Booking.find({ creator: req.user._id });
    const tourIds = bookings.map(booking => booking.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.render('overview', { title: 'My Tours', tours });
  }
);

export const getStatsView = catchAsync(async (req: Request, res: Response) => {
  res.render('stats', { title: 'Your Dashboard' });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email
    },
    { new: true, runValidators: true }
  );

  res.render('dashboard', { title: 'Your Dashboard', user: updatedUser });
});
