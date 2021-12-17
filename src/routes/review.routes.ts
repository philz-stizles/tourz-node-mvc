import express, { NextFunction, Request, Response } from 'express';
import {
  createReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
} from '@src/controllers/review.controllers';
import {
  isAuthenticated,
  isAuthorized,
} from '@src/middlewares/auth.middlewares';

// NESTED ROUTES - finalize nested routing to merge params from parent route into nested route
const router = express.Router({ mergeParams: true });

// router.param('id', checkIfExistsMiddleware)

// Authenticate all routes after this middleware
router.use(isAuthenticated);

router
  .route('/')
  .post(
    isAuthorized('user'),
    (req: Request, _: Response, next: NextFunction) => {
      const { tour, creator } = req.body;
      const { tourId } = req.params;
      if (!tour) req.body.tour = tourId;
      if (!creator) req.body.creator = req.user._id;
      next();
    },
    createReview
  )
  .get((req: Request, _: Response, next: NextFunction) => {
    const { tourId } = req.params;
    if (tourId) req.query.tour = tourId;
    next();
  }, getAllReviews);

router
  .route('/:id')
  .patch(isAuthorized('user', 'admin'), updateReview)
  .get(getReview)
  .delete(isAuthorized('user', 'admin'), deleteReview);

export default router;
