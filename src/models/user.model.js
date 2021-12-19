const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken } = require('../services/security/token.services');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: { type: String, default: 'default.jpg' },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // Note that this will only work with create() and save(), will not work on update, so you need to ensure that
        // you use save() to update the user

        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    isTwoFactorAuthenticationEnabled: { type: Boolean, default: false },
    twoFactorAuthenticationCode: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    isActive: { type: Boolean, default: true, select: false },
    createdAt: { type: Date, required: true, default: Date.now },
    modifiedAt: { type: Date },
  },
  {
    // toJSON: { virtuals: true }, // Turn on virtuals to display virtuals(both populated's and properties)
    // // when transformed to JSON
    // toObject: { virtuals: true }, // Turn on virtuals to display virtual(both populated's and properties)
    // when transformed to Object
  }
);

userSchema.pre('save', async function (next) {
  // If password was not modified, do not encrypt
  if (!this.isModified('password')) return next();

  // Encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // If password was not modified, do not encrypt
  if (!this.isModified('password') || this.isNew) return next(); // When you change password or create a new user,
  // set passwordChange date

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, async function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } }); // Not equal to false is different from is equal to true
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isPasswordChangedAfterTokenGen = function (jwtTimestamp) {
  if (!this.passwordChangedAt) return false;
  const passwordChangedAtInMilliseconds = this.passwordChangedAt.getTime();
  const passwordChangedAtInSeconds = parseInt(
    passwordChangedAtInMilliseconds / 1000
  );

  return passwordChangedAtInSeconds > jwtTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.setCookieToken = function (
  req,
  res,
  isSecondFactorAuthenticated = false
) {
  const user = this;

  const { _id: id, email, role } = user;

  const token = generateToken({
    id,
    role,
    email,
    isSecondFactorAuthenticated,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_AUTH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // This is heroku specific
  };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true;
  // }

  res.cookie('token', token, cookieOptions);
};

module.exports = User = mongoose.model('Users', userSchema);
