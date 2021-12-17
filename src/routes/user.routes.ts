import express from 'express';
import {
  createUser,
  updateMe,
  getAllUsers,
  getMe,
  deleteMe,
  changePassword,
  getUser,
  deleteUser,
  updateUser,
} from '@src/controllers/user.controllers';
import {
  uploadUserPhoto,
  resizeUserPhoto,
} from '@src/middlewares/multer.middlewares';
import {
  isAuthenticated,
  isAuthorized,
} from '@src/middlewares/auth.middlewares';

const router = express.Router();

// Authenticate all routes after this middleware
router.use(isAuthenticated);

router
  .route('/me')
  .get(getMe)
  .patch(uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete(deleteMe);

router.patch('/me/changePassword', changePassword);

// Authorize only admin for all routes after this middleware
router.use(isAuthorized('admin'));

router.route('/').post(createUser).get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
