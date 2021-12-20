import auth from './auth';
import users from './users';
import reviews from './reviews';
import bookings from './bookings';
import coupons from './coupons';
import tours from './tours';
import transactions from './transactions';
import roles from './roles';
import audit from './audit';
import locations from './locations';
import makerchecker from './makerchecker';
import logs from './logs';

export default {
  ...auth,
  ...users,
  ...reviews,
  ...bookings,
  ...coupons,
  ...tours,
  ...transactions,
  ...roles,
  ...audit,
  ...locations,
  ...makerchecker,
  ...logs,
};
