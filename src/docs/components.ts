import sharedSchemas from './schemas/shared.schemas';
import authSchemas from './schemas/auth.schemas';
import userSchemas from './schemas/user.schemas';
import bookingSchemas from './schemas/booking.schemas';
import couponSchemas from './schemas/coupon.schemas';
import tourSchemas from './schemas/tour.schemas';

export default {
  schemas: {
    ...sharedSchemas,
    ...authSchemas,
    ...userSchemas,
    ...bookingSchemas,
    ...couponSchemas,
    ...tourSchemas,
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  responses: {
    UnauthorizedError: {
      description: 'Access token is missing or invalid',
    },
  },
};
