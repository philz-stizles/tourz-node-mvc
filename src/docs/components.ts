import sharedSchemas from './schemas/shared.schemas';
import authSchemas from './schemas/auth.schemas';
import userSchemas from './schemas/user.schemas';
import bookingSchemas from './schemas/booking.schemas';
import couponSchemas from './schemas/coupon.schemas';
import tourSchemas from './schemas/tour.schemas';
import reviewSchemas from './schemas/review.schemas';
import transactionSchemas from './schemas/transaction.schemas';
import roleSchemas from './schemas/role.schemas';
import auditSchemas from './schemas/audit.schemas';
import makercheckerSchemas from './schemas/makerchecker.schemas';
import logSchemas from './schemas/log.schemas';

export default {
  schemas: {
    ...sharedSchemas,
    ...authSchemas,
    ...userSchemas,
    ...bookingSchemas,
    ...couponSchemas,
    ...tourSchemas,
    ...reviewSchemas,
    ...transactionSchemas,
    ...roleSchemas,
    ...auditSchemas,
    ...makercheckerSchemas,
    ...logSchemas,
  },
  parameters: {
    skipParam: {
      name: 'skip',
      in: 'query',
      description: 'number of items to skip',
      required: true,
      schema: {
        type: 'integer',
        format: 'int32',
      },
    },
    limitParam: {
      name: 'limit',
      in: 'query',
      description: 'max records to return',
      required: true,
      schema: {
        type: 'integer',
        format: 'int32',
      },
    },
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
    IllegalInput: {
      description: 'Illegal input for operation.',
    },
    GeneralError: {
      description: 'General Error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/GeneralError',
          },
        },
      },
    },
  },
};
