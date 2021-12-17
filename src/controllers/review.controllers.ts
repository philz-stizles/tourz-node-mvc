// Models. ********************************************** |
import Review from '@src/models/review.model';
// Factories. ******************************************* |
import * as factory from '@src/factories/handler.factory';

// Using handler factories. ***************************** |
export const createReview = factory.createOne(Review);
export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
