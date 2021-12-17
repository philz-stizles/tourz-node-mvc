import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import auth from './paths/auth';
import reviews from './paths/reviews';
import bookings from './paths/bookings';
import coupons from './paths/coupons';
import products from './paths/tours';

export default {
  ...basicInfo,
  servers,
  components,
  tags,
  paths: {
    ...auth,
    ...reviews,
    ...bookings,
    ...coupons,
    ...products,
  },
  // security: [{ bearerAuth: [] }], this applies
};
