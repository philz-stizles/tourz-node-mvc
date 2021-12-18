const express = require('express');
const router = express.Router();
const {
  createUser,
  updateMe,
  getAllUsers,
  getMe,
  deleteMe,
  changePassword,
  getUser,
  deleteUser,
  updateUser,
} = require('../controllers/user.controllers');
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../middlewares/multerMiddlewares');
const { authenticate, authorize } = require('../middlewares/authMiddlewares');

// Authenticate all routes after this middleware
router.use(authenticate);

router
  .route('/me')
  .get(getMe)
  .patch(uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete(deleteMe);

router.patch('/me/changePassword', changePassword);

// Authorize only admin for all routes after this middleware
router.use(authorize('admin'));

router.route('/').post(createUser).get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
